import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings

# Absolute path to backend directory's .env file
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BACKEND_DIR / ".env"

class Settings(BaseSettings):
    PROJECT_NAME: str = "RMVS Web Services"
    PROJECT_DESCRIPTION: str = "Enterprise Web Services, Architecture & Engineering Solutions"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = "devconnect-super-secret-key-change-in-prod-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # SQLite async default fallback, switchable to Neon PostgreSQL:
    # postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require
    DATABASE_URL: str = "sqlite+aiosqlite:///./devconnect.db"
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    SUPER_ADMIN_NAME: str = "Ritesh Lingamallu"
    SUPER_ADMIN_USERNAME: str = "riteshlingamallu8"
    SUPER_ADMIN_EMAIL: str = "riteshlingamallu8@gmail.com"

    class Config:
        case_sensitive = True
        env_file = str(ENV_PATH) if ENV_PATH.exists() else ".env"
        extra = "allow"

settings = Settings()
