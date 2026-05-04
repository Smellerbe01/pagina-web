from fastapi import APIRouter
from app.services.ytdlp_service import download_media

router = APIRouter()

@router.post("/")
def download(data: dict):
    return download_media(data)