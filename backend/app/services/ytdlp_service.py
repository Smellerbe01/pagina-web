import yt_dlp
import logging
import os
from fastapi.responses import FileResponse


# 1. Buscamos la ruta de este archivo: backend/app/services/ytdlp_service.py
current_dir = os.path.dirname(os.path.abspath(__file__))

# 2. Buscamos la carpeta padre que se llama "pagina web"
BASE_DIR = current_dir
while os.path.basename(BASE_DIR) != "pagina web" and os.path.dirname(BASE_DIR) != BASE_DIR:
    BASE_DIR = os.path.dirname(BASE_DIR)

# 3. Definimos la ruta final
DOWNLOAD_PATH = os.path.join(BASE_DIR, "downloads")

# Verificación en consola al arrancar
print(f"\n🚀 SISTEMA DE DESCARGAS LISTO")
print(f"📂 Carpeta de destino: {DOWNLOAD_PATH}\n")

os.makedirs(DOWNLOAD_PATH, exist_ok=True)

#⚠️⚠️ Suppress yt_dlp logs, warnings relacionados con Deno, ya que tengo instalado Node.js y no Deno, y no quiero que aparezcan en la consola.
logging.getLogger('yt_dlp').setLevel(logging.CRITICAL) 

def get_video_info(url):
    try:
        ydl_opts = {
            'quiet': True,
            'extract_flat': 'in_playlist',  # 🔥 Cambio clave: extrae info básica pero suficiente
            'skip_download': True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        # 🔵 PLAYLIST
        if 'entries' in info:
            videos = []
            # Usamos un slice [:10] o [:20] para no saturar si la playlist es de 500 videos
            for entry in info['entries'][:5]: 
                if entry:
                    video_id = entry.get("id")
                    # En modo 'in_playlist', 'duration' ya debería venir disponible
                    duration = entry.get("duration") 

                    videos.append({
                        "id": video_id,
                        "title": entry.get("title"),
                        "duration": duration, 
                        "thumbnail": f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"
                    })

            return {
                "success": True,
                "type": "playlist",
                "playlist_title": info.get("title"),
                "videos": videos,
                "total_duration": info.get("duration") 
            }

        # 🟢 VIDEO NORMAL (Se mantiene igual)
        return {
            "success": True,
            "type": "video",
            "title": info.get("title"),
            "thumbnail": info.get("thumbnail"),
            "duration": info.get("duration")
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
# app/services/ytdlp_service.py

def download_media(data):
    url = data["url"]
    tipo = data["type"]

    if tipo == "audio":
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': f'{DOWNLOAD_PATH}/%(title)s.%(ext)s',
            'noplaylist': True,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        }
    else:
        ydl_opts = {
            'format': 'bestvideo+bestaudio/best',
            'outtmpl': f'{DOWNLOAD_PATH}/%(title)s.%(ext)s',
            'noplaylist': True
        }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        # 1. Extraemos info y descargamos
        info = ydl.extract_info(url, download=True)
        
        # 2. Obtenemos la ruta base que yt-dlp previó
        filename = ydl.prepare_filename(info)
        
        # 3. LÓGICA DE REPARACIÓN:
        # Si descargamos audio, el archivo final NO es .webm o .m4a, es .mp3
        if tipo == "audio":
            # Cambiamos la extensión de la ruta al .mp3 que generó FFmpeg
            filename = os.path.splitext(filename)[0] + ".mp3"

    # 4. Verificación de seguridad antes de enviar
    if not os.path.exists(filename):
        raise FileNotFoundError(f"Error crítico: El archivo {filename} no se encontró tras el proceso.")

    # 5. Enviamos el archivo correcto
    return FileResponse(
        path=filename, 
        media_type="audio/mpeg" if tipo == "audio" else "video/mp4",
        filename=os.path.basename(filename)
    )