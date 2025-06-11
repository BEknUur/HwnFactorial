from celery import Celery
from celery.schedules import crontab
from app.config import settings

celery = Celery(
    __name__,
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.tasks.example", "app.tasks.fetch_data"],
)

celery.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
)

celery.autodiscover_tasks(["app.tasks"])

celery.conf.beat_schedule = {
    "fetch-data-everyday": {
        "task": "app.tasks.fetch_data.fetch_and_save_data",
        "schedule": crontab(hour=0, minute=0),
    },
}
