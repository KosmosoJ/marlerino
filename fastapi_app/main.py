from fastapi import FastAPI
from routers import anetwork, offers, app as web_app
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from models.database import Base, engine
from models.models import *
app = FastAPI()

app.include_router(anetwork.router, tags=['anetwork'])
app.include_router(offers.router, tags=['offers'])
app.include_router(web_app.router )
app.mount('/templates/static', StaticFiles(directory='templates/static'), name='static')


origins = [
    'http://localhost:3000',
    'http://localhost:8000',
    'http://localhost:8080',
    'http://localhost:8005',
    'http://localhost',
]
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']
)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
# init_db()
            