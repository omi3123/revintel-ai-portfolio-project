from fastapi import APIRouter

from app.services.forecast_service import evaluate_models, forecast_by_group, forecast_overall

router = APIRouter()


@router.get('/overall')
def overall_forecast(horizon: int = 30):
    return forecast_overall(horizon)


@router.get('/model-metrics')
def model_metrics():
    return evaluate_models()


@router.get('/category/{name}')
def category_forecast(name: str, horizon: int = 30):
    return forecast_by_group('category', name, horizon)


@router.get('/region/{name}')
def region_forecast(name: str, horizon: int = 30):
    return forecast_by_group('region', name, horizon)
