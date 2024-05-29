from pydantic import BaseModel


class OfferBase(BaseModel):
    id:int
    ANet_id:int
    payout_currency:str
    payout_value:int
    country:str
    state:str
    daily_cap:int

class OfferCreate(BaseModel):
    name:str
    ANet_id:int
    payout_currency:str
    payout_value:int
    country:str
    state:str
    daily_cap:int
