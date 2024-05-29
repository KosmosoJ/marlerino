from fastapi import Depends, APIRouter, HTTPException
from models.database import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from utils import offers as offers_api
from schemas import offers as offer_scheme
from utils import anetwork as anetwork_api
import os
import aiohttp


router = APIRouter(prefix='/api')

headers = {
    'Api-Key':os.environ.get('API_KEY'),
    'Content-Type': 'application/json'
}

async def make_get_request(url):
    """ GET запрос  """
    async with aiohttp.ClientSession(headers=headers) as session:
            async with session.get(url) as response:
                    return await response.json()


        
async def make_post_request(url,data):
    """ POST запрос """
    async with aiohttp.ClientSession(headers=headers) as session:
            async with session.post(url=url, data=data) as response:
                    return await response.json()     

@router.get('/offers/')
async def get_offers(session:AsyncSession = Depends(get_session)):
    """ Получить все офферы из базы данных """
    offers = await offers_api.get_offers(session)
    if not offers:
        return None
    return [{'id':offer.id,
             "ANet_id":offer.ANet_id,
             'payout_currency':offer.payout_currency,
             'payout_value':offer.payout_value,
             'country':offer.country,
             'keitaro_id':offer.keitaro_id,
             'state':offer.state,
             'daily_cap':offer.daily_cap,
             "name":offer.name,
             } for offer in offers]

@router.get('/offer/{id}')
async def get_offer(id:int, session:AsyncSession = Depends(get_session)):
    """ Получить оффер из бд по ID """
    offer = await offers_api.get_offer(id,session)
    return {'offer':offer}

@router.post('/offer/')
async def create_offer(offer_info:offer_scheme.OfferCreate, session:AsyncSession = Depends(get_session)):
    """ Апи для создания оффера """
    offer = await offers_api.create_offer(offer_info,session)
    if not offer:
        raise HTTPException(404, 'Не удалось создать оффер')
    return offer

@router.get('/keitaro_offers/')
async def get_keitaro_offers():
    """ Получить все офферы из keitaro """
    response = await make_get_request('https://mytrackertest.com/admin_api/v1/offers')
    if response:
        data = response
        return data 
    else:
        raise HTTPException(500, response.status)
        
@router.get('/keitaro_offers/{id}')
async def get_keitaro_offer(id:int):
    """ Получить оффер из keitaro по ID """
    response = await make_get_request(f'https://mytrackertest.com/admin_api/v1/offers/{id}')
    if response:
        data = response
        return data 
    raise HTTPException(404, 'Не найден оффер с таким id')
    
    
@router.get('/keitaro_offer/{offer_id}')
async def post_keitaro_offer(offer_id:int, session:AsyncSession = Depends(get_session)):
    """ Отправить оффер из бд в кейтаро """
    offer_info = await offers_api.get_offer(offer_id, session)
    affnet_info = await anetwork_api.get_anetwork(offer_info.ANet_id, session)
    
    if affnet_info:
        if affnet_info.keitaro_id:
            context = {
                "name":f"{offer_info.name}",
                    "offer_type":"local",
                    "affiliate_network_id":affnet_info.keitaro_id,
                    "payout_value":offer_info.payout_value,
                    "payout_currency":f"{offer_info.payout_currency}",
                    "state":'active' if offer_info.state == 'On' else 'deleted',
                    "country":f"{offer_info.country}",
                    "daily_cap":offer_info.daily_cap,
                    }

            response = await make_post_request('https://mytrackertest.com/admin_api/v1/offers',context)
            
            if response:
                offer_info.keitaro_id = response['id']
                session.add(offer_info)
                await session.commit()
                
                return response
            else:
                return response
        raise HTTPException(status_code=400, detail='Сеть не добавлена в keitaro')
    raise HTTPException(status_code=404, detail='У оффера нет сети.')
