from __future__ import annotations

from dataclasses import dataclass
from math import sqrt

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression

from app.services.data_service import get_daily_revenue_frame, load_sales_data


@dataclass
class ForecastOutput:
    model: str
    mae: float
    rmse: float
    mape: float
    bias: float


def _build_features(series: pd.DataFrame) -> pd.DataFrame:
    frame = series.copy()
    frame['t'] = np.arange(len(frame))
    frame['dow'] = frame['ds'].dt.dayofweek
    frame['month'] = frame['ds'].dt.month
    frame['week'] = frame['ds'].dt.isocalendar().week.astype(int)
    frame['lag_1'] = frame['revenue'].shift(1)
    frame['lag_7'] = frame['revenue'].shift(7)
    frame['rolling_7'] = frame['revenue'].shift(1).rolling(7).mean()
    frame['rolling_14'] = frame['revenue'].shift(1).rolling(14).mean()
    return frame.dropna().reset_index(drop=True)


def _split(frame: pd.DataFrame, test_size: int = 30) -> tuple[pd.DataFrame, pd.DataFrame]:
    if len(frame) <= test_size + 30:
        test_size = max(7, len(frame) // 5)
    return frame.iloc[:-test_size].copy(), frame.iloc[-test_size:].copy()


def _calc_metrics(actual: np.ndarray, pred: np.ndarray, model_name: str) -> ForecastOutput:
    mae = float(np.mean(np.abs(actual - pred)))
    rmse = float(sqrt(np.mean((actual - pred) ** 2)))
    denom = np.where(actual == 0, 1, actual)
    mape = float(np.mean(np.abs((actual - pred) / denom)) * 100)
    bias = float(np.mean(pred - actual))
    return ForecastOutput(model_name, round(mae, 2), round(rmse, 2), round(mape, 2), round(bias, 2))


def evaluate_models() -> list[dict]:
    daily = get_daily_revenue_frame()
    feats = _build_features(daily)
    train, test = _split(feats)
    feature_cols = ['t', 'dow', 'month', 'week', 'lag_1', 'lag_7', 'rolling_7', 'rolling_14']

    metrics = []

    baseline_pred = np.repeat(train['revenue'].tail(7).mean(), len(test))
    metrics.append(_calc_metrics(test['revenue'].to_numpy(), baseline_pred, 'Moving Average'))

    lin = LinearRegression()
    lin.fit(train[feature_cols], train['revenue'])
    lin_pred = lin.predict(test[feature_cols])
    metrics.append(_calc_metrics(test['revenue'].to_numpy(), lin_pred, 'Linear Regression'))

    forest = RandomForestRegressor(n_estimators=200, random_state=42, min_samples_leaf=2)
    forest.fit(train[feature_cols], train['revenue'])
    forest_pred = forest.predict(test[feature_cols])
    metrics.append(_calc_metrics(test['revenue'].to_numpy(), forest_pred, 'Random Forest'))

    ordered = sorted(metrics, key=lambda item: item.mape)
    return [item.__dict__ for item in ordered]


def _future_dates(last_date: pd.Timestamp, horizon: int) -> pd.DatetimeIndex:
    return pd.date_range(last_date + pd.Timedelta(days=1), periods=horizon, freq='D')


def forecast_overall(horizon: int = 30) -> dict:
    horizon = 7 if horizon <= 7 else 30 if horizon <= 30 else 90
    daily = get_daily_revenue_frame()
    feats = _build_features(daily)
    metrics = evaluate_models()
    best_model = metrics[0]['model']
    feature_cols = ['t', 'dow', 'month', 'week', 'lag_1', 'lag_7', 'rolling_7', 'rolling_14']

    model = None
    if best_model == 'Linear Regression':
        model = LinearRegression().fit(feats[feature_cols], feats['revenue'])
    elif best_model == 'Random Forest':
        model = RandomForestRegressor(n_estimators=200, random_state=42, min_samples_leaf=2)
        model.fit(feats[feature_cols], feats['revenue'])

    history = daily[['ds', 'revenue']].copy()
    forecast_rows: list[dict] = []
    residual_std = max(float(history['revenue'].pct_change().dropna().std() * history['revenue'].mean()), 1.0)

    for future_date in _future_dates(history['ds'].max(), horizon):
        temp = history.copy()
        temp = pd.concat([temp, pd.DataFrame([{'ds': future_date, 'revenue': np.nan}])], ignore_index=True)
        feat_row = _build_features(temp.ffill().fillna(temp['revenue'].mean())).tail(1)
        if best_model == 'Moving Average':
            pred = float(history['revenue'].tail(7).mean())
        else:
            pred = float(model.predict(feat_row[feature_cols])[0])
        pred = max(pred, 0.0)
        history = pd.concat([history, pd.DataFrame([{'ds': future_date, 'revenue': pred}])], ignore_index=True)
        forecast_rows.append({
            'ds': future_date,
            'forecast': round(pred, 2),
            'upper': round(pred + residual_std * 1.1, 2),
            'lower': round(max(pred - residual_std * 1.1, 0), 2),
        })

    actual_tail = daily.tail(min(45, len(daily))).copy()
    actual_tail['label'] = actual_tail['ds'].dt.strftime('%b %d')
    actual_tail['actual'] = actual_tail['revenue'].round(2)
    actual_tail['forecast'] = 0.0
    actual_tail['upper'] = 0.0
    actual_tail['lower'] = 0.0
    actual_tail['type'] = 'actual'

    forecast_df = pd.DataFrame(forecast_rows)
    forecast_df['label'] = forecast_df['ds'].dt.strftime('%b %d')
    forecast_df['actual'] = 0.0
    forecast_df['type'] = 'forecast'

    series = pd.concat([
        actual_tail[['label', 'actual', 'forecast', 'upper', 'lower', 'type']],
        forecast_df[['label', 'actual', 'forecast', 'upper', 'lower', 'type']]
    ], ignore_index=True)

    projected_revenue = round(float(forecast_df['forecast'].sum()), 2)
    last_30 = float(daily.tail(min(30, len(daily)))['revenue'].sum())
    projected_delta = round(((projected_revenue - last_30) / max(last_30, 1)) * 100, 1)

    df = load_sales_data()
    strongest_category = df.groupby('category')['sales'].sum().idxmax()
    strongest_region = df.groupby('region')['sales'].sum().idxmax()

    return {
        'horizon': horizon,
        'projected_revenue': projected_revenue,
        'projected_delta': projected_delta,
        'best_model': best_model,
        'series': series.to_dict(orient='records'),
        'narrative': [
            f'{best_model} delivered the lowest validation error on the historical sales series.',
            f'Projected revenue for the next {horizon} days is {projected_delta}% versus the latest comparable window.',
            f'{strongest_category} and {strongest_region} remain the strongest commercial contributors in the seeded portfolio.'
        ]
    }


def forecast_by_group(group_col: str, name: str, horizon: int = 30) -> dict:
    df = load_sales_data()
    scoped = df[df[group_col].str.lower() == name.lower()].copy()
    if scoped.empty:
        return {group_col: name, 'projected_revenue': 0, 'best_model': 'Moving Average'}
    daily = scoped.groupby(scoped['order_date'].dt.normalize(), as_index=False).agg(revenue=('sales', 'sum'))
    daily = daily.rename(columns={'order_date': 'ds'})
    daily['ds'] = pd.to_datetime(daily.iloc[:,0])
    daily = daily.rename(columns={daily.columns[0]: 'ds'})
    avg = float(daily['revenue'].tail(min(14, len(daily))).mean())
    projected = round(avg * horizon, 2)
    return {group_col: name, 'projected_revenue': projected, 'best_model': 'Moving Average'}
