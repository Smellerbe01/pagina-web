from fastapi import APIRouter
from app.services.ytdlp_service import get_video_info

router = APIRouter()

@router.post("/")
def info(data: dict):
    return get_video_info(data["url"])