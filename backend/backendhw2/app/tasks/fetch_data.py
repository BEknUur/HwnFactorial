
import os
import requests
from datetime import datetime
from sqlalchemy.orm import Session

from app.celery_app import celery
from app.db.session import SessionLocal
from app.db.models.data import DataRecord

FETCH_URL = os.getenv(
    "FETCH_DATA_URL",
    "https://jsonplaceholder.typicode.com/posts"
)

@celery.task(name="app.tasks.fetch_data.fetch_and_save_data")
def fetch_and_save_data():
    try:
        resp = requests.get(FETCH_URL, timeout=10)
        resp.raise_for_status()
    except Exception as e:
        celery.logger.error(f"fetch_data: error fetching {FETCH_URL}: {e}")
        return

    data_json = resp.json()
    db: Session = SessionLocal()
    try:
        record = DataRecord(
            timestamp=datetime.utcnow(),
            content=data_json
        )
        db.add(record)
        db.commit()
        celery.logger.info(f"fetch_data: saved record id={record.id}")
    finally:
        db.close()
