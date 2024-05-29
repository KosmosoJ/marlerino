from sqlalchemy import select 
from models.models import ANetwork
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.anetwork import ANetworkCreate as anet_scheme


def create_anet_name(aff_net):
    """ Функция для создания имени сети """
    return f'aff_network_{aff_net}_check'

async def get_anetworks(session:AsyncSession):
    """ Запрос к бд на получение всех сетей """
    anets = await session.execute(select(ANetwork))
    anets = anets.unique().scalars().all()
    
    if not anets:
        return None
    return anets

async def get_anetwork(anet_id:int,session:AsyncSession):
    """ Запрос к бд на получение сети по ID """
    anet = await session.execute(select(ANetwork).where(ANetwork.id == anet_id))
    anet = anet.scalars().first()
    
    if not anet:
        return None
    return anet

async def create_anet(anet_name:anet_scheme, session:AsyncSession):
    """ Запрос к бд на создание сети """
    check_anet = await session.execute(select(ANetwork).where(ANetwork.ANet_name == create_anet_name(anet_name.Network_name)))
    check_anet = check_anet.unique().scalars().first()
    if check_anet:
        return None
    new_anet = ANetwork(ANet_name = create_anet_name(anet_name.Network_name))
    session.add(new_anet)
    await session.commit()
    return new_anet