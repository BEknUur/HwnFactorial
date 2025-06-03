import os
import json
import warnings
from typing import List, Optional
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel, Field, ValidationError

warnings.filterwarnings("ignore", message=".*Assistants API is deprecated.*")

load_dotenv()

class Note(BaseModel):
    id: int = Field(..., ge=1, le=10, description="Unique note ID from 1-10")
    heading: str = Field(..., example="Multi-Head Attention", description="Concise heading for the note")
    summary: str = Field(..., max_length=150, description="Brief summary of the concept")
    page_ref: Optional[int] = Field(None, description="Page number in source PDF")

class NotesCollection(BaseModel):
    notes: List[Note] = Field(..., min_items=10, max_items=10, description="Exactly 10 study notes")

def generate_notes_with_assistant(client, assistant_id, topic="Attention Is All You Need PDF"):
    thread = client.beta.threads.create()
    prompt = f"""
    Please analyze the {topic} and create exactly 10 concise revision notes.
    Each note should cover a key concept from the Transformer paper that would be important for understanding and exam preparation.
    
    Return your response as a JSON object with this exact structure:
    {{
        "notes": [
            {{
                "id": 1,
                "heading": "Concept Name",
                "summary": "Brief explanation in 150 characters or less",
                "page_ref": null
            }},
            ... (continue for all 10 notes)
        ]
    }}
    
    Make sure:
    - Each note has a unique ID from 1-10
    - Headings are concise and descriptive of Transformer components or ideas
    - Summaries are under 150 characters
    - Cover diverse important concepts such as self-attention, multi-head attention, positional encoding, and feed-forward networks
    """
    client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=prompt
    )
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id
    )
    import time
    while True:
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )
        if run.status == "completed":
            break
        elif run.status == "failed":
            print(f"Run failed: {run.last_error}")
            return None
        elif run.status in ["cancelling", "cancelled", "expired"]:
            print(f"Run {run.status}")
            return None
        print(f"Generating notes... ({run.status})")
        time.sleep(2)
    messages = client.beta.threads.messages.list(thread_id=thread.id)
    for message in messages:
        if message.role == "assistant":
            return message.content[0].text.value
    return None

def generate_notes_with_chat_completion(client):
    system_prompt = """
    You are a study summarizer for the paper "Attention Is All You Need".
    Return exactly 10 unique notes covering key concepts from this paper.
    Respond only with valid JSON matching this schema:
    {
        "notes": [
            {
                "id": number (1-10),
                "heading": "string",
                "summary": "string (max 150 chars)",
                "page_ref": number or null
            }
        ]
    }
    """
    user_prompt = """
    Create 10 revision notes covering these topics from the Transformer paper:
    1. Scaled Dot-Product Attention
    2. Multi-Head Attention
    3. Positional Encoding
    4. Encoder and Decoder architecture
    5. Feed-Forward Networks in Transformer
    6. Residual Connections and Layer Normalization
    7. Training details and optimizer schedule
    8. Regularization techniques (dropout, label smoothing)
    9. Comparison of self-attention with recurrent and convolutional models
    10. Results and benchmarks on WMT 2014 translation tasks
    
    Each note should be concise and exam-focused.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating notes: {e}")
        return None

def validate_and_parse_notes(json_content):
    try:
        json_content = json_content.strip()
        print(f"Final JSON content length: {len(json_content)}")
        print(f"JSON starts with: {json_content[:100]}...")
        if "```json" in json_content:
            start_idx = json_content.find("```json") + 7
            end_idx = json_content.rfind("```")
            if end_idx > start_idx:
                json_content = json_content[start_idx:end_idx].strip()
                print("✅ Extracted from ```json block")
        elif "```" in json_content:
            lines = json_content.split('\n')
            in_code_block = False
            json_lines = []
            for line in lines:
                if line.strip().startswith('```') and not in_code_block:
                    in_code_block = True
                    continue
                elif line.strip() == '```' and in_code_block:
                    break
                elif in_code_block:
                    json_lines.append(line)
            if json_lines:
                json_content = '\n'.join(json_lines).strip()
                print("✅ Extracted from generic code block")
        if not json_content.strip().startswith("{"):
            start_brace = json_content.find("{")
            end_brace = json_content.rfind("}")
            if start_brace != -1 and end_brace != -1 and end_brace > start_brace:
                json_content = json_content[start_brace:end_brace + 1]
                print("✅ Extracted JSON object from text")
        data = json.loads(json_content)
        notes_collection = NotesCollection(**data)
        return notes_collection.notes
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {e}")
        print(f"Content being parsed: {json_content[:200]}...")
        return None
    except ValidationError as e:
        print(f"❌ Validation error: {e}")
        return None

def save_notes(notes, filename="exam_notes.json"):
    notes_dict = {
        "notes": [note.model_dump() for note in notes]
    }
    with open(filename, 'w') as f:
        json.dump(notes_dict, f, indent=2)
    print(f"✅ Notes saved to {filename}")

def print_pretty_notes(notes):
    print("\n" + "="*60)
    print("📚 GENERATED STUDY NOTES")
    print("="*60)
    for note in notes:
        print(f"\n📝 Note {note.id}: {note.heading}")
        print(f"   Summary: {note.summary}")
        if note.page_ref:
            print(f"   Page Reference: {note.page_ref}")
        print("-" * 50)

def main():
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    print("🔄 Generating 10 structured exam notes...")
    assistant_file = "assistant_info.json"
    json_content = None
    if os.path.exists(assistant_file):
        with open(assistant_file, 'r') as f:
            assistant_info = json.load(f)
        print("📖 Using assistant with Attention Is All You Need PDF...")
        json_content = generate_notes_with_assistant(client, assistant_info['id'])
    if not json_content:
        print("📝 Using chat completion with JSON mode...")
        json_content = generate_notes_with_chat_completion(client)
    if not json_content:
        print("❌ Failed to generate notes")
        return
    print("✨ Raw JSON response received")
    print("🔍 Validating with Pydantic schema...")
    notes = validate_and_parse_notes(json_content)
    if not notes:
        print("❌ Failed to validate notes")
        print("Raw response:")
        print(json_content)
        return
    print(f"✅ Successfully generated {len(notes)} valid notes!")
    print_pretty_notes(notes)
    save_notes(notes)
    print(f"\n✅ All notes passed Pydantic validation:")
    print(f"   - All IDs are between 1-10")
    print(f"   - All summaries are ≤ 150 characters")
    print(f"   - All required fields are present")
    print(f"   - Exactly {len(notes)} notes generated")

if __name__ == "__main__":
    main()
