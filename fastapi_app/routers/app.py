from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

router = APIRouter()

templates = Jinja2Templates(directory='templates')

@router.get('/')
async def root(request:Request):
    return templates.TemplateResponse(request=request, name='homepage.html')

@router.get('/admin/')
async def admin_app(request:Request):
    return templates.TemplateResponse(request=request, name='admin.html' )