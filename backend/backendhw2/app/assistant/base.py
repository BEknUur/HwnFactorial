from abc import ABC, abstractmethod

class Assistant(ABC):
    @abstractmethod
    def send_message(self, prompt: str) -> str:
        ...