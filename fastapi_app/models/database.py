from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv, find_dotenv
import os

sql_db_path = 'postgresql+asyncpg://postgres:postgres@localhost:5432/foo'

engine = create_async_engine(sql_db_path,echo=True)

async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

if not find_dotenv():
    raise EnvironmentError('Не найден файл .env')
else:
    load_dotenv()
    if not os.environ.get('API_KEY'):
        raise EnvironmentError('Не найдена переменная API_KEY в файле .env')
    else:
        API_KEY = os.environ.get('API_KEY')


async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session
        