from fastapi import FastAPI
from app.db.session import Base, engine
from app.api.v1.items import router as items_router


Base.metadata.create_all(bind=engine)

app = FastAPI(title="FastAPI + PostgreSQL + Redis + Celery")

app.include_router(
    items_router,
    prefix="/api/v1/items",
    tags=["items"],
)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}