import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GEMINI_API_KEY: str = "your_gemini_api_key_here"
    DATABASE_URL: str = "sqlite:///./insightforge.db"
    PORT: int = 8000
    HOST: str = "127.0.0.1"
    ENVIRONMENT: str = "development"

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
