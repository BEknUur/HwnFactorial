import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

def main():
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    assistant_file = "assistant_info.json"
    if os.path.exists(assistant_file):
        with open(assistant_file, 'r') as f:
            assistant_info = json.load(f)
        print(f"Using existing assistant: {assistant_info['id']}")
        return assistant_info

    print("Creating new Transformer Tutor Assistant...")
    assistant = client.beta.assistants.create(
        name="Transformer Tutor Assistant",
        instructions=(
            "You are a knowledgeable tutor for the paper 'Attention Is All You Need'. "
            "When asked, provide concise answers based solely on the content of the attached PDF. "
            "Always cite page numbers when referencing specific sections."
        ),
        model="gpt-4o-mini",
        tools=[{"type": "file_search"}]
    )

    file_path = "attentionisallyouneed.pdf"
    if os.path.exists(file_path):
        with open(file_path, "rb") as file_obj:
            uploaded_file = client.files.create(
                file=file_obj,
                purpose="assistants"
            )
        try:
            vector_store = client.vector_stores.create(name="TransformerPaperStore")
            client.vector_stores.files.create(
                vector_store_id=vector_store.id,
                file_id=uploaded_file.id
            )
        except AttributeError:
            vector_store = client.beta.vector_stores.create(name="TransformerPaperStore")
            client.beta.vector_stores.files.create(
                vector_store_id=vector_store.id,
                file_id=uploaded_file.id
            )

        client.beta.assistants.update(
            assistant.id,
            tool_resources={"file_search": {"vector_store_ids": [vector_store.id]}}
        )
        assistant_info = {
            "id": assistant.id,
            "name": assistant.name,
            "vector_store_id": vector_store.id,
            "file_id": uploaded_file.id
        }
        with open(assistant_file, 'w') as f:
            json.dump(assistant_info, f, indent=2)
        print(f"Assistant created successfully: {assistant.id}")
        print(f"Assistant info saved to {assistant_file}")
        return assistant_info
    else:
        print(f"Study material not found at {file_path}")
        return None

if __name__ == "__main__":
    main()
