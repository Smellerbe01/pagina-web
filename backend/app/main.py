from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import info
from app.routes import info, download


app = FastAPI()

ydl_opts = {
    # Esta es la línea mágica para quitar esa advertencia:
    'prefer_ffmpeg': True,
    'javascript_runtime': 'node', 
    'js_runtime': 'node',
    'quiet': True,
    'no_warnings': True,
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(info.router, prefix="/info")
app.include_router(download.router, prefix="/download")
