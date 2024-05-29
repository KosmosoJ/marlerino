from fastapi import Depends, APIRouter, HTTPException
from models.database import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from utils import anetwork as anetwork_api
from schemas import anetwork as anet_scheme
from .offers import make_get_request, make_post_request
import json

router = APIRouter(prefix='/api')

@router.get('/aff_networks/')
async def get_networks(session:AsyncSession = Depends(get_session)):
    """ Получить все сети из БД """
    anets = await anetwork_api.get_anetworks(session)
    if not anets:
        return {"Message":'Сети еще не созданы'}
    return [{'id':anet.id, "name":anet.ANet_name} for anet in anets]

@router.get('/aff_network/{id}')
async def get_network(id:int, session:AsyncSession = Depends(get_session)):
    """ Получить сеть из бд по ID """
    anet = await anetwork_api.get_anetwork(id,session)
    if not anet:
        return HTTPException(400, f"Сеть с id '{id}' не найдена")
    return {'aff_network':anet}

@router.post('/aff_network/')
async def create_network(affnet_info:anet_scheme.ANetworkCreate ,session:AsyncSession = Depends(get_session)):
    """ Создать сеть в БД """
    anet = await anetwork_api.create_anet(affnet_info, session)
    if not anet:
        raise HTTPException(404, 'Не удалось создать сеть, такая уже существует')
    return anet

@router.get('/keitaro_affnets/')
async def get_keitaro_affnets():
    """ Получить сети из апи keitaro """
    response = await make_get_request('https://mytrackertest.com/admin_api/v1/affiliate_networks')
    if response:
        data = response
        return data
    else:
        raise HTTPException(404, 'Не найдено.')
    
@router.get('/keitaro_affnets/{id}')
async def get_keitaro_affnets(id:int):
    """ Получить сеть из апи keitaro по ID"""
    response = await make_get_request(f'https://mytrackertest.com/admin_api/v1/affiliate_networks/{id}')
    if response:
        data = response
        return data
    else:
        raise HTTPException(404, 'Не найдена сеть с таким ID.')


    
@router.post('/keitaro_affnet/{affnet_id}')
async def post_keitaro_affnet(affnet_id:int, session:AsyncSession = Depends(get_session)):
    """ Отправить запрос к апи keitaro на создание сети из бд по ID """
    anet_info = await anetwork_api.get_anetwork(affnet_id, session)
    if not anet_info:
        raise HTTPException(404, detail='Не нашли сеть с таким айди')
    data = json.dumps({"name":f"{str(anet_info.ANet_name).strip()}"})
    print(len(anet_info.ANet_name))
    response = await make_post_request(url="https://mytrackertest.com/admin_api/v1/affiliate_networks", data=data)
    # response = await make_post_request(url='1', data=data)
    if response:
        anet_info.keitaro_id = response['id']
        session.add(anet_info)
        await session.commit()
        return response
    
