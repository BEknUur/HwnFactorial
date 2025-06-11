from abc import ABC, abstractmethod

class Assistant(ABC):
    @abstractmethod
    def send_message(self, prompt: str) -> str:
        """
        Send a prompt to the assistant and return its response.
        """
        pass
    