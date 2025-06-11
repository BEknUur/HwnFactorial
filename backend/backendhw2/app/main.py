from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.db.session import Base, engine
from app.api.v1.items import router as items_router
from app.api.v1.chat import router as chat_router


Base.metadata.create_all(bind=engine)

app = FastAPI(title="backendhw2")




app.include_router(items_router, prefix="/api/v1/items", tags=["items"])
app.include_router(chat_router,   prefix="/api/v1/chat",  tags=["chat"])


app.mount(
    "/", 
    StaticFiles(directory="frontend", html=True), 
    name="frontend"
)
