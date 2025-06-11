from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.assistant.chatbot import Chatbot

router = APIRouter()

class ChatRequest(BaseModel):
    provider: str
    prompt: str

class ChatResponse(BaseModel):
    response: str

@router.post("/", response_model=ChatResponse)
def chat(req: ChatRequest):
    try:
        bot = Chatbot(req.provider)
        ans = bot.ask(req.prompt)
        return ChatResponse(response=ans)
    except ValueError as e:
        raise HTTPException(400, str(e))
