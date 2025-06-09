from fastapi import FastAPI
from app.api import public
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI(    )
app.include_router(public.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      
    allow_methods=["*"],
    allow_headers=["*"],
)