from __future__ import annotations

import os
import sqlite3
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parents[2]
DB_DIR = BASE_DIR / 'data'
DB_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = Path(os.getenv('REVINTEL_DB_PATH', str(DB_DIR / 'revintel.db')))
DB_PATH.parent.mkdir(parents=True, exist_ok=True)


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.execute(
            '''
            CREATE TABLE IF NOT EXISTS scenario_runs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL,
                price_change REAL NOT NULL,
                discount_change REAL NOT NULL,
                ad_spend_change REAL NOT NULL,
                seasonality_uplift REAL NOT NULL,
                inventory_shortage REAL NOT NULL,
                projected_revenue REAL NOT NULL,
                projected_profit REAL NOT NULL,
                projected_orders REAL NOT NULL,
                margin_rate REAL NOT NULL,
                risk_level TEXT NOT NULL
            )
            '''
        )
        conn.execute(
            '''
            CREATE TABLE IF NOT EXISTS uploads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL,
                file_path TEXT NOT NULL,
                records_loaded INTEGER NOT NULL,
                start_date TEXT NOT NULL,
                end_date TEXT NOT NULL
            )
            '''
        )
        conn.commit()


def insert_upload(metadata: dict[str, Any]) -> None:
    with get_connection() as conn:
        conn.execute(
            '''
            INSERT INTO uploads (created_at, file_path, records_loaded, start_date, end_date)
            VALUES (?, ?, ?, ?, ?)
            ''',
            (
                metadata['created_at'],
                metadata['file_path'],
                metadata['records_loaded'],
                metadata['start_date'],
                metadata['end_date'],
            ),
        )
        conn.commit()


def latest_upload_path() -> str | None:
    with get_connection() as conn:
        row = conn.execute('SELECT file_path FROM uploads ORDER BY id DESC LIMIT 1').fetchone()
    return row['file_path'] if row else None


def insert_scenario_run(payload: dict[str, Any]) -> None:
    with get_connection() as conn:
        conn.execute(
            '''
            INSERT INTO scenario_runs (
                created_at, price_change, discount_change, ad_spend_change,
                seasonality_uplift, inventory_shortage, projected_revenue,
                projected_profit, projected_orders, margin_rate, risk_level
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''',
            (
                payload['created_at'],
                payload['price_change'],
                payload['discount_change'],
                payload['ad_spend_change'],
                payload['seasonality_uplift'],
                payload['inventory_shortage'],
                payload['projected_revenue'],
                payload['projected_profit'],
                payload['projected_orders'],
                payload['margin_rate'],
                payload['risk_level'],
            ),
        )
        conn.commit()


def fetch_recent_scenarios(limit: int = 10) -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute(
            'SELECT * FROM scenario_runs ORDER BY id DESC LIMIT ?',
            (limit,),
        ).fetchall()
    return [dict(row) for row in rows]
