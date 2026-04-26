from datetime import datetime

from fastapi import APIRouter
from pydantic import BaseModel

from app.db.storage import fetch_recent_scenarios, insert_scenario_run
from app.services.forecast_service import forecast_overall

router = APIRouter()


class ScenarioInput(BaseModel):
    price_change: float = 0
    discount_change: float = 0
    ad_spend_change: float = 0
    seasonality_uplift: float = 0
    inventory_shortage: float = 0


@router.post('/run')
def run_scenario(payload: ScenarioInput):
    base = forecast_overall(30)
    base_revenue = float(base['projected_revenue'])
    base_profit = round(base_revenue * 0.235, 2)
    base_orders = round(base_revenue / 82.0)

    revenue_multiplier = 1 + (payload.price_change * 0.0025) + (payload.ad_spend_change * 0.0018) + (payload.seasonality_uplift * 0.0035) - (payload.inventory_shortage * 0.0055) + (payload.discount_change * 0.002)
    profit_multiplier = 1 + (payload.price_change * 0.004) - (abs(payload.discount_change) * 0.0035) + (payload.ad_spend_change * 0.0009) - (payload.inventory_shortage * 0.0045)
    order_multiplier = 1 + (payload.discount_change * 0.0048) + (payload.ad_spend_change * 0.0018) + (payload.seasonality_uplift * 0.0028) - (payload.inventory_shortage * 0.0038) - (payload.price_change * 0.0012)

    projected_revenue = round(base_revenue * revenue_multiplier, 2)
    projected_profit = round(base_profit * profit_multiplier, 2)
    projected_orders = int(round(base_orders * order_multiplier))
    margin_rate = round((projected_profit / max(projected_revenue, 1)) * 100, 1)

    downside = max(payload.inventory_shortage, 0) + max(-payload.discount_change, 0)
    upside = max(payload.ad_spend_change, 0) + max(payload.seasonality_uplift, 0)
    risk_level = 'high' if downside >= 18 else 'medium' if downside >= 9 else 'low'

    notes = [
        f'Projected revenue moves to approximately ${projected_revenue:,.0f} with a modelled margin rate of {margin_rate}%.',
        f'Expected order volume shifts to roughly {projected_orders:,}, driven by the combined pricing and demand levers in this scenario.',
        'Inventory shortage remains the strongest downside variable, while seasonality and media spend contribute the cleanest upside in this sandbox model.'
    ]
    if upside > downside:
        notes.append('This configuration leans growth-oriented and should be paired with strong fulfillment readiness.')
    else:
        notes.append('This configuration carries moderate delivery risk and should be validated before a client-facing recommendation.')

    record = {
        'created_at': datetime.utcnow().isoformat(timespec='seconds'),
        'price_change': payload.price_change,
        'discount_change': payload.discount_change,
        'ad_spend_change': payload.ad_spend_change,
        'seasonality_uplift': payload.seasonality_uplift,
        'inventory_shortage': payload.inventory_shortage,
        'projected_revenue': projected_revenue,
        'projected_profit': projected_profit,
        'projected_orders': projected_orders,
        'margin_rate': margin_rate,
        'risk_level': risk_level,
    }
    insert_scenario_run(record)

    return {
        'projected_revenue': projected_revenue,
        'projected_profit': projected_profit,
        'projected_orders': projected_orders,
        'margin_rate': margin_rate,
        'risk_level': risk_level,
        'notes': notes,
    }


@router.get('/history')
def scenario_history(limit: int = 6):
    return fetch_recent_scenarios(limit)
