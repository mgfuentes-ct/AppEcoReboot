# app/core/database.py
import sqlalchemy
import databases
from core.config import DATABASE_URL

# Database connection and metadata
metadata = sqlalchemy.MetaData()
database = databases.Database(DATABASE_URL)