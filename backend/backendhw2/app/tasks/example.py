from app.celery_app import celery
import time

@celery.task
def example_task(user_id: int):
    time.sleep(5)
    return f"Processed user {user_id}"
