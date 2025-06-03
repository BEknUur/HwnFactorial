import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()
ASSISTANT_ID_FILE = ".assistant_id"


def save_assistant_id(aid: str) -> None:
    with open(ASSISTANT_ID_FILE, "w") as f:
        f.write(aid)


def get_assistant_id() -> str:
    if not os.path.exists(ASSISTANT_ID_FILE):
        raise RuntimeError("Assistant not bootstrapped – run 00_bootstrap.py first")
    with open(ASSISTANT_ID_FILE) as f:
        return f.read().strip()
