from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

import pandas as pd

from app.db.storage import latest_upload_path

DATA_DIR = Path(__file__).resolve().parents[2] / 'data'
SEED_FILE = DATA_DIR / 'revintel_sales_sample.csv'
UPLOAD_DIR = Path(os.getenv('REVINTEL_UPLOAD_DIR', str(DATA_DIR / 'uploads')))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

REQUIRED_COLUMNS = [
    'order_id',
    'order_date',
    'product_name',
    'category',
    'sub_category',
    'region',
    'city',
    'channel',
    'customer_segment',
    'sales',
    'profit',
    'quantity',
    'discount',
]

NUMERIC_COLUMNS = ['sales', 'profit', 'quantity', 'discount']


def get_active_data_file() -> Path:
    latest = latest_upload_path()
    if latest:
        path = Path(latest)
        if path.exists():
            return path
    return SEED_FILE


def clear_data_cache() -> None:
    load_sales_data.cache_clear()


def validate_dataset(df: pd.DataFrame) -> None:
    missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {', '.join(missing)}")


def _prepare(df: pd.DataFrame) -> pd.DataFrame:
    validate_dataset(df)
    cleaned = df.copy()
    cleaned['order_date'] = pd.to_datetime(cleaned['order_date'])
    for col in NUMERIC_COLUMNS:
        cleaned[col] = pd.to_numeric(cleaned[col], errors='coerce')
    cleaned['quantity'] = cleaned['quantity'].fillna(0).astype(int)
    cleaned['sales'] = cleaned['sales'].fillna(0.0).astype(float)
    cleaned['profit'] = cleaned['profit'].fillna(0.0).astype(float)
    cleaned['discount'] = cleaned['discount'].fillna(0.0).astype(float)
    cleaned = cleaned.dropna(subset=['order_date'])
    return cleaned.sort_values('order_date').reset_index(drop=True)


@lru_cache(maxsize=1)
def load_sales_data() -> pd.DataFrame:
    df = pd.read_csv(get_active_data_file())
    return _prepare(df)


def load_uploaded_dataframe(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path)
    return _prepare(df)


def get_current_year_data() -> pd.DataFrame:
    df = load_sales_data()
    current_year = int(df['order_date'].dt.year.max())
    return df[df['order_date'].dt.year == current_year].copy()


def get_daily_revenue_frame(df: pd.DataFrame | None = None) -> pd.DataFrame:
    source = load_sales_data() if df is None else df
    daily = (
        source.assign(ds=source['order_date'].dt.normalize())
        .groupby('ds', as_index=False)
        .agg(
            revenue=('sales', 'sum'),
            profit=('profit', 'sum'),
            orders=('order_id', 'nunique'),
            quantity=('quantity', 'sum'),
            discount=('discount', 'mean'),
        )
    )
    return daily.sort_values('ds').reset_index(drop=True)
