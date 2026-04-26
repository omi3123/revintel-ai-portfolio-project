from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_healthcheck() -> None:
    response = client.get('/')
    assert response.status_code == 200
    payload = response.json()
    assert payload['version'] == '2.0.0'


def test_dashboard_summary_endpoint() -> None:
    response = client.get('/api/dashboard/summary')
    assert response.status_code == 200
    payload = response.json()
    assert 'total_revenue' in payload
    assert 'total_orders' in payload
