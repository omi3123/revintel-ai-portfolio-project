from fastapi import APIRouter

from app.services.analytics_service import get_category_performance, get_low_products, get_product_summary, get_top_product_table

router = APIRouter()


@router.get('/performance')
def product_performance():
    return get_category_performance()


@router.get('/summary')
def product_summary():
    return get_product_summary()


@router.get('/top')
def top_products():
    return get_top_product_table(limit=6)


@router.get('/low-performing')
def low_products():
    return get_low_products(limit=3)
