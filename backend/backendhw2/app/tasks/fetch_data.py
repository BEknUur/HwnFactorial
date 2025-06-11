import os, requests
from datetime import datetime
from celery.utils.log import get_task_logger
from sqlalchemy.orm import Session

from app.celery_app import celery
from app.db.session import SessionLocal
from app.db.models.data import DataRecord

FETCH_URL = os.getenv("FETCH_DATA_URL")
logger = get_task_logger(__name__)

@celery.task(name="app.tasks.fetch_data.fetch_and_save_data")
def fetch_and_save_data():
    try:
        resp = requests.get(FETCH_URL, timeout=10)
        resp.raise_for_status()
    except Exception as e:
        logger.error(f"fetch_data error fetching {FETCH_URL}: {e}")
        return

    data_json = resp.json()
    db: Session = SessionLocal()
    try:
        r = DataRecord(timestamp=datetime.utcnow(), content=data_json)
        db.add(r)
        db.commit()
        logger.info(f"Saved data record id={r.id}")
    finally:
        db.close()
