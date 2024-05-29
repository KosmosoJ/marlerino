from sqlalchemy import select 
from models.models import Offer
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.offers import OfferCreate as offer_scheme

async def get_offers(session:AsyncSession):
    """ Запрос к бд на получение всех офферов """
    offers = await session.execute(select(Offer))
    offers = offers.unique().scalars().all()
    
    if not offers:
        return {"Message":'Пока-что нет офферов'}
    return offers

async def get_offer(id:int, session:AsyncSession):
    """ Запрос к бд на получение оффера по ID """
    offer = await session.execute(select(Offer).where(Offer.id == id))
    offer = offer.unique().scalars().first()
    
    if not offer:
        return {'Message':f'Оффер с id "{id}" не найден'}
    return offer

async def create_offer(offer_info:offer_scheme, session:AsyncSession):
    """ Запрос к бд на создание оффера в бд """
    try:
        new_offer = Offer(
            name=f'offer_{offer_info.name}_check',
            ANet_id = offer_info.ANet_id,
            payout_currency = offer_info.payout_currency,
            payout_value = offer_info.payout_value,
            country = offer_info.country,
            state = offer_info.state,
            daily_cap = offer_info.daily_cap
        )
        session.add(new_offer)
        await session.commit()
        return new_offer
    except Exception as ex:
        await session.rollback()
        return None