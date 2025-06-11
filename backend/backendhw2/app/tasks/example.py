from app.celery_app import celery

@celery.task
def example_task(user_id: int):
    print(f"Processing user {user_id}")
    return f"Processed user {user_id}"
