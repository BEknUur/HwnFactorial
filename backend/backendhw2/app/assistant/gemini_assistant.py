import os
from openai import OpenAI
from app.assistant.base import Assistant

class GeminiAssistant(Assistant):
   

    def __init__(self, api_key: str = None):
        key = api_key or os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")
        if not key:
            raise RuntimeError("No GEMINI_API_KEY or OPENAI_API_KEY found in env")
        self.client = OpenAI(api_key=key)

    def send_message(self, prompt: str) -> str:
        resp = self.client.chat.completions.create(
            model="gpt-3.5-turbo",  
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=150,
        )
        return resp.choices[0].message.content.strip()
