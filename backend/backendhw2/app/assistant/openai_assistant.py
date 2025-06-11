import os
import openai

from app.assistant.base import Assistant

class OpenAIAssistant(Assistant):
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        openai.api_key = self.api_key

    def send_message(self, prompt: str) -> str:
        resp = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            max_tokens=150
        )
        return resp.choices[0].text.strip()
