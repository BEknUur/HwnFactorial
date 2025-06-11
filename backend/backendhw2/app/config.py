from pydantic import BaseSettings

class Settings(BaseSettings):
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_HOST: str
    POSTGRES_PORT: int

    DATABASE_URL: str
    REDIS_URL: str
    CELERY_BROKER_URL: str
    CELERY_RESULT_BACKEND: str
    FETCH_DATA_URL:str
    OPENAI_API_KEY:str
    GEMINI_API_KEY:str


    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
