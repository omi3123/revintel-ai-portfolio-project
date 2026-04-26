from fastapi import APIRouter
from fastapi.responses import FileResponse

from app.services.analytics_service import get_report_library
from app.services.export_service import export_dataset_csv, export_executive_pdf, export_forecast_csv

router = APIRouter()


@router.get('/library')
def report_library():
    library = get_report_library()
    for item in library:
        if item['type'] == 'PDF':
            item['download'] = '/api/reports/executive-pdf'
        elif 'CSV' in item['type']:
            item['download'] = '/api/reports/export-csv'
        else:
            item['download'] = '/api/reports/forecast-csv?horizon=30'
    return library


@router.get('/export-csv')
def report_export_csv():
    path = export_dataset_csv()
    return FileResponse(path, media_type='text/csv', filename=path.name)


@router.get('/forecast-csv')
def report_export_forecast(horizon: int = 30):
    path = export_forecast_csv(horizon)
    return FileResponse(path, media_type='text/csv', filename=path.name)


@router.get('/executive-pdf')
def report_export_pdf():
    path = export_executive_pdf()
    return FileResponse(path, media_type='application/pdf', filename=path.name)
