from app.assistant.openai_assistant import OpenAIAssistant
from app.assistant.gemini_assistant import GeminiAssistant

class Chatbot:
    def __init__(self, provider: str):
        self.provider = provider.lower()
        if self.provider == "openai":
            self.assistant = OpenAIAssistant()
        elif self.provider == "gemini":
            self.assistant = GeminiAssistant()
        elif self.provider == "a2a":
         
            self.openai = OpenAIAssistant()
            self.gemini = GeminiAssistant()
        else:
            raise ValueError(f"Unknown provider '{provider}'")

    def ask(self, prompt: str) -> str:
        if self.provider == "a2a":
            resp1 = self.openai.send_message(prompt)
            resp2 = self.gemini.send_message(prompt)
            return f"OpenAI says:\n{resp1}\n\nGemini says:\n{resp2}"
        else:
            return self.assistant.send_message(prompt)
