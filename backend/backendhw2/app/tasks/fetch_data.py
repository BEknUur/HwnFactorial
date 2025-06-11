import os
import requests
from datetime import datetime
from sqlalchemy.orm import Session
from celery.utils.log import get_task_logger

from app.celery_app import celery
from app.db.session import SessionLocal
from app.db.models.data import DataRecord

FETCH_URL = os.getenv("FETCH_DATA_URL")


logger = get_task_logger(__name__)

@celery.task(name="app.tasks.fetch_data.fetch_and_save_data")
def fetch_and_save_data():
    """Fetch JSON data from FETCH_URL and save it into the database."""
    try:
        resp = requests.get(FETCH_URL, timeout=10)
        resp.raise_for_status()
    except Exception as e:
        logger.error(f"fetch_data error fetching {FETCH_URL}: {e}")
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
        logger.info(f"Saved data record id={record.id}")
    finally:
        db.close()
