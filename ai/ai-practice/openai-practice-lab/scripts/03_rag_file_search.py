#!/usr/bin/env python3
"""
03 — RAG via file_search Lab (Updated for latest API)

End-to-end RAG demonstration using OpenAI's file_search.
"""

import os
import sys
import time
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

def get_client():
    """Initialize OpenAI client."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("❌ Error: OPENAI_API_KEY not found")
        sys.exit(1)
    return OpenAI(api_key=api_key)

def load_assistant_id():
    """Load assistant ID from file."""
    assistant_file = Path(".assistant")
    if not assistant_file.exists():
        print("❌ Run 00_init_assistant.py first")
        sys.exit(1)
    return assistant_file.read_text().strip()

def create_sample_documents():
    """Generate sample markdown files."""
    data_dir = Path("data")
    data_dir.mkdir(exist_ok=True)
    
    docs = {
        "llm_guide.md": """# LLM Guide\n- Models: GPT-4, Claude, LLaMA\n- Uses: Chat, Q&A, Code""",
        "api_guide.md": """# API Guide\n- Auth: Use API keys\n- Best practices: Error handling"""
    }
    
    for name, content in docs.items():
        (data_dir / name).write_text(content)
    
    print(f"📄 Created documents in {data_dir}/")
    return list(docs.keys())

def upload_files(client, file_names):
    """Upload files to OpenAI."""
    print("📤 Uploading files...")
    uploaded = []
    for name in file_names:
        with open(f"data/{name}", "rb") as f:
            file = client.files.create(file=f, purpose="assistants")
            uploaded.append(file.id)
            print(f"  ✅ {name} → {file.id}")
    return uploaded

def create_assistant_with_files(client, file_ids):
    """Create assistant with file_search capability."""
    print("\n🛠️ Creating assistant with file_search...")
    
    assistant = client.beta.assistants.create(
        name="RAG Lab Assistant",
        instructions="Use file_search to answer questions about uploaded documents.",
        tools=[{"type": "file_search"}],
        model="gpt-4-turbo",
        tool_resources={
            "file_search": {
                "vector_store_ids": [create_vector_store(client, file_ids)]
            }
        }
    )
    
    print(f"✅ Assistant created: {assistant.id}")
    return assistant

def create_vector_store(client, file_ids):
    """Create vector store and attach files."""
    print("\n🗂️ Creating vector store...")
    
    # Create empty vector store
    vector_store = client.beta.vector_stores.create(name="Lab Documents")
    print(f"  🆔 Vector Store ID: {vector_store.id}")
    
    # Add files
    client.beta.vector_stores.file_batches.create_and_poll(
        vector_store_id=vector_store.id,
        file_ids=file_ids
    )
    
    print("✅ Files processed in vector store")
    return vector_store.id

def query_assistant(client, assistant_id, query):
    """Execute a query using the assistant."""
    print(f"\n🔍 Query: {query}")
    
    # Create thread and run
    thread = client.beta.threads.create(
        messages=[{"role": "user", "content": query}]
    )
    
    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread.id,
        assistant_id=assistant_id
    )
    
    if run.status != "completed":
        print(f"❌ Run failed: {run.status}")
        return None
    
    # Get response
    messages = client.beta.threads.messages.list(thread_id=thread.id)
    response = messages.data[0].content[0].text.value
    print("🤖 Response:")
    print(response[:500] + ("..." if len(response) > 500 else ""))
    return response

def main():
    print("\n🚀 OpenAI RAG Lab (Updated)")
    print("=" * 50)
    
    client = get_client()
    
    try:
        # 1. Setup documents
        file_names = create_sample_documents()
        file_ids = upload_files(client, file_names)
        
        # 2. Create assistant with vector store
        assistant = create_assistant_with_files(client, file_ids)
        
        # 3. Run queries
        queries = [
            "What models are mentioned in the documents?",
            "Explain API authentication best practices"
        ]
        
        for query in queries:
            query_assistant(client, assistant.id, query)
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        print("\n🎯 Lab complete!")

if __name__ == "__main__":
    main()