from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

import numpy as np
import pandas as pd

from app.services.data_service import REQUIRED_COLUMNS, get_current_year_data, load_sales_data


@dataclass(frozen=True)
class PeriodWindow:
    current_start: pd.Timestamp
    current_end: pd.Timestamp
    previous_start: pd.Timestamp
    previous_end: pd.Timestamp


def pct_change(current: float, previous: float) -> float:
    if previous == 0:
        return 0.0
    return round(((current - previous) / previous) * 100, 1)


def _latest_30d_windows(df: pd.DataFrame) -> PeriodWindow:
    latest = df['order_date'].max().normalize()
    current_start = latest - pd.Timedelta(days=29)
    previous_end = current_start - pd.Timedelta(days=1)
    previous_start = previous_end - pd.Timedelta(days=29)
    return PeriodWindow(current_start, latest, previous_start, previous_end)


def _current_previous_periods(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    window = _latest_30d_windows(df)
    current = df[(df['order_date'] >= window.current_start) & (df['order_date'] <= window.current_end)]
    previous = df[(df['order_date'] >= window.previous_start) & (df['order_date'] <= window.previous_end)]
    return current, previous


def _quarter_growth_by_group(df: pd.DataFrame, group_col: str) -> pd.DataFrame:
    latest = df['order_date'].max()
    current_start = latest - pd.Timedelta(days=89)
    previous_end = current_start - pd.Timedelta(days=1)
    previous_start = previous_end - pd.Timedelta(days=89)
    current = df[(df['order_date'] >= current_start) & (df['order_date'] <= latest)]
    previous = df[(df['order_date'] >= previous_start) & (df['order_date'] <= previous_end)]
    cur = current.groupby(group_col)['sales'].sum().rename('current_revenue')
    prev = previous.groupby(group_col)['sales'].sum().rename('previous_revenue')
    joined = pd.concat([cur, prev], axis=1).fillna(0).reset_index()
    joined['growth'] = joined.apply(lambda row: pct_change(row['current_revenue'], row['previous_revenue']), axis=1)
    return joined


def get_dashboard_summary() -> dict:
    full_df = load_sales_data()
    current_df = get_current_year_data()
    current_period, previous_period = _current_previous_periods(full_df)

    total_revenue = round(current_df['sales'].sum(), 2)
    total_orders = int(current_df['order_id'].nunique())
    total_profit = round(current_df['profit'].sum(), 2)
    average_order_value = round(total_revenue / max(total_orders, 1), 2)

    current_revenue = current_period['sales'].sum()
    previous_revenue = previous_period['sales'].sum()
    current_orders = current_period['order_id'].nunique()
    previous_orders = previous_period['order_id'].nunique()
    current_profit = current_period['profit'].sum()
    previous_profit = previous_period['profit'].sum()
    current_aov = current_revenue / max(current_orders, 1)
    previous_aov = previous_revenue / max(previous_orders, 1)

    revenue_growth = pct_change(current_revenue, previous_revenue)
    order_growth = pct_change(current_orders, previous_orders)
    profit_growth = pct_change(current_profit, previous_profit)
    aov_growth = pct_change(current_aov, previous_aov)

    projected_multiplier = 1 + max(min(revenue_growth / 100 * 0.7, 0.18), -0.08)
    forecast_revenue = round(current_revenue * projected_multiplier, 2)
    forecast_growth = pct_change(forecast_revenue, current_revenue)

    top_category = (
        current_df.groupby('category')['sales'].sum().sort_values(ascending=False).index[0]
    )
    recent_regional = _quarter_growth_by_group(full_df, 'region').sort_values('growth')
    weakest_region = recent_regional.iloc[0]['region']

    category_margin = (
        current_df.groupby('category').agg(revenue=('sales', 'sum'), margin=('profit', 'sum'))
        .assign(margin_pct=lambda frame: (frame['margin'] / frame['revenue']) * 100)
        .sort_values('revenue', ascending=False)
    )
    low_margin_category = category_margin['margin_pct'].idxmin()

    avg_discount = round(current_df['discount'].mean() * 100, 1)

    insights = [
        f'{top_category} is the largest revenue contributor this year, leading the commercial mix across the portfolio.',
        f'{weakest_region} is the weakest region over the latest 90-day window and should be reviewed before the next campaign cycle.',
        f'Average discount depth is {avg_discount}%, while {low_margin_category} shows the most pressure on profit quality.'
    ]

    return {
        'total_revenue': float(total_revenue),
        'total_orders': int(total_orders),
        'total_profit': float(total_profit),
        'forecast_revenue': float(forecast_revenue),
        'average_order_value': float(average_order_value),
        'revenue_growth': float(revenue_growth),
        'order_growth': float(order_growth),
        'profit_growth': float(profit_growth),
        'forecast_growth': float(forecast_growth),
        'aov_growth': float(aov_growth),
        'insights': insights,
    }


def get_revenue_trend() -> list[dict]:
    df = get_current_year_data().copy()
    monthly = (
        df.assign(month=df['order_date'].dt.to_period('M').dt.to_timestamp())
        .groupby('month', as_index=False)['sales']
        .sum()
    )
    monthly['month'] = monthly['month'].dt.strftime('%b')
    monthly['revenue'] = monthly['sales'].round(2)
    return monthly[['month', 'revenue']].to_dict(orient='records')


def get_profit_trend() -> list[dict]:
    df = get_current_year_data().copy()
    monthly = (
        df.assign(month=df['order_date'].dt.to_period('M').dt.to_timestamp())
        .groupby('month', as_index=False)['profit']
        .sum()
    )
    monthly['month'] = monthly['month'].dt.strftime('%b')
    monthly['profit'] = monthly['profit'].round(2)
    return monthly[['month', 'profit']].to_dict(orient='records')


def get_category_performance() -> list[dict]:
    df = get_current_year_data()
    grouped = (
        df.groupby('category', as_index=False)['sales']
        .sum()
        .sort_values('sales', ascending=False)
        .rename(columns={'sales': 'revenue'})
    )
    grouped['revenue'] = grouped['revenue'].round(2)
    return grouped.to_dict(orient='records')


def _top_product_growth_frame() -> pd.DataFrame:
    df = load_sales_data()
    growth = _quarter_growth_by_group(df, 'product_name')
    current_df = get_current_year_data()
    product_meta = current_df.groupby('product_name').agg(
        category=('category', 'first'),
        sub_category=('sub_category', 'first'),
        revenue=('sales', 'sum'),
    )
    merged = product_meta.merge(growth[['product_name', 'growth']], on='product_name', how='left').fillna({'growth': 0})
    return merged.sort_values('revenue', ascending=False).reset_index(drop=True)


def get_top_products(limit: int = 4) -> list[dict]:
    top = _top_product_growth_frame().head(limit).copy()
    top['revenue'] = top['revenue'].round(2)
    top['growth'] = top['growth'].round(1)
    top['segment'] = top['sub_category']
    return top[['product_name', 'segment', 'revenue', 'growth']].rename(columns={'product_name': 'product'}).to_dict(orient='records')


def get_product_summary() -> list[dict]:
    current_df = get_current_year_data()
    category_frame = current_df.groupby('category').agg(
        revenue=('sales', 'sum'),
        profit=('profit', 'sum'),
        avg_discount=('discount', 'mean'),
    )
    category_frame['margin_pct'] = (category_frame['profit'] / category_frame['revenue']) * 100
    growth = _quarter_growth_by_group(load_sales_data(), 'category').set_index('category')
    category_frame = category_frame.join(growth[['growth']]).fillna({'growth': 0})

    top_category = category_frame['revenue'].idxmax()
    margin_opportunity = category_frame.sort_values(['revenue', 'margin_pct'], ascending=[False, True]).index[0]
    risk_category = category_frame['growth'].idxmin()

    return [
        {'label': 'Top category', 'value': top_category, 'note': 'Largest revenue contributor based on current-year sales.'},
        {'label': 'Margin opportunity', 'value': margin_opportunity, 'note': 'Strong demand, but margin performance trails the portfolio average.'},
        {'label': 'Risk category', 'value': risk_category, 'note': 'Weakest 90-day growth trend and should be monitored for demand softness.'},
    ]


def get_top_product_table(limit: int = 6) -> list[dict]:
    table = _top_product_growth_frame().head(limit).copy()
    table['revenue'] = table['revenue'].round(2)
    table['growth'] = table['growth'].round(1)
    return table[['product_name', 'category', 'revenue', 'growth']].rename(columns={'product_name': 'product'}).to_dict(orient='records')


def get_low_products(limit: int = 3) -> list[dict]:
    frame = _top_product_growth_frame().copy()
    low = frame.sort_values(['growth', 'revenue'], ascending=[True, True]).head(limit)
    rows = []
    for _, item in low.iterrows():
        rows.append({
            'product': item['product_name'],
            'issue': f"Revenue momentum is down {abs(item['growth']):.1f}% over the latest 90-day period.",
            'action': f"Review pricing, bundle design, and regional placement for {item['category'].lower()} before the next commercial cycle.",
        })
    return rows


def get_regions_summary() -> list[dict]:
    current_df = get_current_year_data()
    grouped = current_df.groupby('region').agg(revenue=('sales', 'sum'), profit=('profit', 'sum'))
    growth = _quarter_growth_by_group(load_sales_data(), 'region').set_index('region')
    grouped = grouped.join(growth[['growth']]).fillna({'growth': 0})
    grouped['margin_pct'] = (grouped['profit'] / grouped['revenue']) * 100

    notes = []
    for region, row in grouped.iterrows():
        if row['growth'] < 0:
            note = 'Demand softened versus the previous quarter and needs intervention.'
        elif row['margin_pct'] > grouped['margin_pct'].median():
            note = 'Healthy blended performance with solid revenue quality.'
        else:
            note = 'Stable revenue flow with room to improve pricing quality.'
        notes.append({'region': region, 'revenue': float(round(row['revenue'], 2)), 'growth': float(round(row['growth'], 1)), 'note': note})

    return sorted(notes, key=lambda item: item['revenue'], reverse=True)


def get_regions_heatmap() -> list[dict]:
    grouped = pd.DataFrame(get_regions_summary())
    revenue_scale = grouped['revenue'] / grouped['revenue'].max()
    growth_scale = (grouped['growth'] - grouped['growth'].min()) / max(grouped['growth'].max() - grouped['growth'].min(), 1)
    score = np.round((revenue_scale * 55 + growth_scale * 45)).astype(int)
    grouped['score'] = score.clip(55, 95)

    def tone_for(value: int) -> str:
        if value >= 86:
            return 'border-emerald-200 bg-emerald-50 text-emerald-700'
        if value >= 76:
            return 'border-brand-200 bg-brand-50 text-brand-700'
        if value >= 66:
            return 'border-slate-200 bg-slate-50 text-slate-700'
        return 'border-rose-200 bg-rose-50 text-rose-700'

    comments = []
    for _, row in grouped.iterrows():
        if row['growth'] >= 8:
            comment = 'Strong demand momentum with healthy regional contribution.'
        elif row['growth'] >= 0:
            comment = 'Steady territory performance with moderate upside potential.'
        else:
            comment = 'Cooling demand and lower conversion suggest closer commercial review.'
        comments.append({
            'region': row['region'],
            'score': str(int(row['score'])),
            'comment': comment,
            'tone': tone_for(int(row['score'])),
        })
    return comments


def _weekly_anomaly_frame() -> pd.DataFrame:
    df = load_sales_data().copy()
    df['week_start'] = df['order_date'] - pd.to_timedelta(df['order_date'].dt.dayofweek, unit='D')
    weekly = df.groupby(['week_start', 'region'], as_index=False)['sales'].sum().sort_values(['region', 'week_start'])
    weekly['rolling_mean'] = weekly.groupby('region')['sales'].transform(lambda s: s.rolling(6, min_periods=3).mean())
    weekly['rolling_std'] = weekly.groupby('region')['sales'].transform(lambda s: s.rolling(6, min_periods=3).std().fillna(0))
    weekly['z_score'] = (weekly['sales'] - weekly['rolling_mean']) / weekly['rolling_std'].replace(0, np.nan)
    return weekly.dropna(subset=['z_score'])


def get_anomalies(limit: int = 5) -> list[dict]:
    weekly = _weekly_anomaly_frame()
    focus = weekly[weekly['week_start'].dt.year == weekly['week_start'].dt.year.max()].copy()
    focus['abs_z'] = focus['z_score'].abs()
    focus = focus.sort_values('abs_z', ascending=False).head(limit)
    records = []
    for _, row in focus.iterrows():
        direction = 'spiked' if row['z_score'] > 0 else 'dropped'
        severity = 'high' if row['abs_z'] >= 2.4 else 'medium' if row['abs_z'] >= 1.8 else 'low'
        delta_pct = abs(round((row['sales'] - row['rolling_mean']) / row['rolling_mean'] * 100, 1)) if row['rolling_mean'] else 0
        records.append({
            'date': row['week_start'].strftime('%Y-%m-%d'),
            'severity': severity,
            'message': f"{row['region']} region revenue {direction} {delta_pct}% versus its six-week baseline.",
            'context': 'This alert is generated from weekly sales variance and highlights regions moving materially away from recent demand patterns.',
        })
    if not records:
        return [{'date': load_sales_data()['order_date'].max().strftime('%Y-%m-%d'), 'severity': 'low', 'message': 'No material anomalies detected in the current weekly window.', 'context': 'Data variability remains within the normal operating band.'}]
    return records


def get_anomalies_summary() -> dict:
    anomalies = get_anomalies(limit=12)
    counts = {'high': 0, 'medium': 0, 'low': 0}
    for item in anomalies:
        counts[item['severity']] += 1
    return counts


def get_anomalies_timeline(weeks: int = 8) -> list[dict]:
    weekly = _weekly_anomaly_frame().copy()
    if weekly.empty:
        return []
    weekly['risk'] = weekly['z_score'].abs().apply(lambda value: 3 if value >= 2.4 else 2 if value >= 1.8 else 1 if value >= 1.4 else 0)
    timeline = weekly.groupby('week_start', as_index=False)['risk'].sum().tail(weeks)
    timeline['week'] = ['W' + str(index + 1) for index in range(len(timeline))]
    return timeline[['week', 'risk']].to_dict(orient='records')


def get_data_health() -> dict:
    df = load_sales_data()
    record_count = len(df)
    start_date = df['order_date'].min()
    end_date = df['order_date'].max()
    month_coverage = (end_date.year - start_date.year) * 12 + (end_date.month - start_date.month) + 1
    null_rate = round((df.isna().sum().sum() / (df.shape[0] * df.shape[1])) * 100, 2)
    schema_match = round((len(set(REQUIRED_COLUMNS).intersection(df.columns)) / len(REQUIRED_COLUMNS)) * 100)
    return {
        'records_loaded': f'{record_count:,}',
        'date_coverage': f'{month_coverage} months',
        'null_rate': f'{null_rate}%',
        'schema_match': f'{schema_match}%',
        'start_date': start_date.strftime('%Y-%m-%d'),
        'end_date': end_date.strftime('%Y-%m-%d'),
        'available_columns': list(df.columns),
    }


def get_report_library() -> list[dict]:
    health = get_data_health()
    return [
        {
            'title': 'Executive Monthly Summary',
            'subtitle': 'Computed from the seeded retail dataset',
            'type': 'PDF',
            'size': 'Dynamic',
            'description': f"Uses {health['records_loaded']} rows covering {health['start_date']} to {health['end_date']} for KPI reporting.",
        },
        {
            'title': 'Category & Product Snapshot',
            'subtitle': 'Revenue mix and product contribution pack',
            'type': 'CSV / PDF',
            'size': 'Dynamic',
            'description': 'Designed for product-level reviews, commercial analysis, and stakeholder-ready deck exports.',
        },
        {
            'title': 'Territory Risk Board',
            'subtitle': 'Region mix with anomaly watch indicators',
            'type': 'PNG Bundle',
            'size': '8 assets',
            'description': 'Portfolio-ready visuals that combine regional intensity with alert tracking and performance context.',
        },
    ]
