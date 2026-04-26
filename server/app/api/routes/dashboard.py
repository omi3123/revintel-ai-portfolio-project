from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.db.storage import insert_upload
from app.services.analytics_service import (
    get_category_performance,
    get_dashboard_summary,
    get_data_health,
    get_profit_trend,
    get_regions_summary,
    get_revenue_trend,
    get_top_products,
)
from app.services.data_service import UPLOAD_DIR, clear_data_cache, load_uploaded_dataframe

router = APIRouter()


@router.get('/summary')
def get_summary():
    return get_dashboard_summary()


@router.get('/revenue-trend')
def revenue_trend():
    return get_revenue_trend()


@router.get('/profit-trend')
def profit_trend():
    return get_profit_trend()


@router.get('/top-products')
def top_products():
    return get_top_products(limit=4)


@router.get('/regions')
def region_summary():
    return get_regions_summary()


@router.get('/category-performance')
def category_performance():
    return get_category_performance()


@router.get('/data-health')
def data_health():
    return get_data_health()


@router.post('/upload-csv')
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.csv'):
        raise HTTPException(status_code=400, detail='Only CSV files are supported.')
    timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
    safe_name = f'{timestamp}_{Path(file.filename).name}'
    destination = UPLOAD_DIR / safe_name
    content = await file.read()
    destination.write_bytes(content)
    try:
        df = load_uploaded_dataframe(destination)
    except Exception as exc:
        destination.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    insert_upload(
        {
            'created_at': datetime.utcnow().isoformat(timespec='seconds'),
            'file_path': str(destination),
            'records_loaded': int(len(df)),
            'start_date': df['order_date'].min().strftime('%Y-%m-%d'),
            'end_date': df['order_date'].max().strftime('%Y-%m-%d'),
        }
    )
    clear_data_cache()
    return {
        'message': 'Dataset uploaded successfully.',
        'records_loaded': int(len(df)),
        'start_date': df['order_date'].min().strftime('%Y-%m-%d'),
        'end_date': df['order_date'].max().strftime('%Y-%m-%d'),
    }
