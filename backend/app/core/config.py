import os
from dotenv import load_dotenv

load_dotenv()

DOWNLOAD_PATH = os.getenv("DOWNLOAD_PATH", "downloads")