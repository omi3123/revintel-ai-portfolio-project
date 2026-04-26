from fastapi import APIRouter

from app.services.analytics_service import get_anomalies, get_anomalies_summary, get_anomalies_timeline

router = APIRouter()


@router.get('')
def anomalies_list():
    return get_anomalies(limit=5)


@router.get('/summary')
def anomalies_summary():
    return get_anomalies_summary()


@router.get('/timeline')
def anomalies_timeline():
    return get_anomalies_timeline(weeks=8)
