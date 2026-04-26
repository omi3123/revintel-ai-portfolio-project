from fastapi import APIRouter

from app.services.analytics_service import get_regions_heatmap, get_regions_summary

router = APIRouter()


@router.get('/performance')
def regions_performance():
    return get_regions_summary()


@router.get('/heatmap')
def regions_heatmap():
    return get_regions_heatmap()
