import os
from sqlmodel import create_engine
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env if present

user = os.getenv('POSTGRES_USER')
password = os.getenv('POSTGRES_PASSWORD')
host = os.getenv('POSTGRES_HOST')
port = os.getenv('POSTGRES_PORT')
db = os.getenv('POSTGRES_DB')

if not all([user, password, host, db]):
    print("One or more required environment variables are missing!")
    print(f"user={user}, password={password}, host={host}, db={db}, port={port}")

if port:
    DB_URL = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}"
else:
    DB_URL = f"postgresql+psycopg2://{user}:{password}@{host}/{db}"

engine = create_engine(DB_URL, echo=False)
