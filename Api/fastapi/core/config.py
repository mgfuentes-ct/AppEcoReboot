# app/core/config.py
import os

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "ecoreboot_prueba")
DB_PORT = os.getenv("DB_PORT", "3306")

DATABASE_URL = f"mysql+aiomysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# CORS
ALLOWED_ORIGINS = ["*"]
ALLOWED_METHODS = ["*"]
ALLOWED_HEADERS = ["*"]