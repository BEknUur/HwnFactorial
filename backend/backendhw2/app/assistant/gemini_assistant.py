from app.assistant.base import Assistant

class GeminiAssistant(Assistant):
    def __init__(self, client):
        """
        client — ваш SDK или HTTP-клиент для Gemini.
        """
        self.client = client

    def send_message(self, prompt: str) -> str:
        response = self.client.chat(prompt)
        return response.text
