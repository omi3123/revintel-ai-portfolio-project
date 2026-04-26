from __future__ import annotations

from datetime import datetime
from pathlib import Path

import pandas as pd
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from app.services.analytics_service import get_dashboard_summary, get_regions_summary, get_top_products
from app.services.data_service import load_sales_data
from app.services.forecast_service import forecast_overall

EXPORT_DIR = Path(__file__).resolve().parents[2] / 'data' / 'exports'
EXPORT_DIR.mkdir(parents=True, exist_ok=True)


def export_dataset_csv() -> Path:
    path = EXPORT_DIR / 'revintel_export.csv'
    load_sales_data().to_csv(path, index=False)
    return path


def export_forecast_csv(horizon: int = 30) -> Path:
    payload = forecast_overall(horizon)
    path = EXPORT_DIR / f'revintel_forecast_{horizon}d.csv'
    pd.DataFrame(payload['series']).to_csv(path, index=False)
    return path


def export_executive_pdf() -> Path:
    path = EXPORT_DIR / 'revintel_executive_summary.pdf'
    summary = get_dashboard_summary()
    forecast = forecast_overall(30)
    top_products = get_top_products(4)
    regions = get_regions_summary()[:4]

    c = canvas.Canvas(str(path), pagesize=A4)
    width, height = A4
    y = height - 50

    c.setFont('Helvetica-Bold', 18)
    c.drawString(40, y, 'RevIntel AI - Executive Summary')
    y -= 28
    c.setFont('Helvetica', 10)
    c.drawString(40, y, f'Generated on {datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")}')
    y -= 30

    c.setFont('Helvetica-Bold', 13)
    c.drawString(40, y, 'Executive KPIs')
    y -= 20
    c.setFont('Helvetica', 11)
    for label, value in [
        ('Total revenue', f"${summary['total_revenue']:,.0f}"),
        ('Total orders', f"{summary['total_orders']:,}"),
        ('Total profit', f"${summary['total_profit']:,.0f}"),
        ('30-day forecast', f"${summary['forecast_revenue']:,.0f}"),
    ]:
        c.drawString(50, y, f'{label}: {value}')
        y -= 16

    y -= 10
    c.setFont('Helvetica-Bold', 13)
    c.drawString(40, y, 'Forecast narrative')
    y -= 18
    c.setFont('Helvetica', 11)
    for line in forecast['narrative']:
        c.drawString(50, y, f'- {line}')
        y -= 16

    y -= 10
    c.setFont('Helvetica-Bold', 13)
    c.drawString(40, y, 'Top products')
    y -= 18
    c.setFont('Helvetica', 11)
    for item in top_products:
        c.drawString(50, y, f"- {item['product']}: ${item['revenue']:,.0f} | {item['growth']}% growth")
        y -= 16

    y -= 10
    c.setFont('Helvetica-Bold', 13)
    c.drawString(40, y, 'Regional highlights')
    y -= 18
    c.setFont('Helvetica', 11)
    for item in regions:
        c.drawString(50, y, f"- {item['region']}: ${item['revenue']:,.0f} | {item['growth']}% growth")
        y -= 16

    c.save()
    return path
