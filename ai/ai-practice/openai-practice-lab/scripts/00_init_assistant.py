#!/usr/bin/env python3
"""
00 — Assistant Bootstrap Script

Creates or updates a reusable OpenAI assistant with file_search capabilities.
Stores the ASSISTANT_ID in a local .assistant file for reuse across labs.

Usage: python scripts/00_init_assistant.py

Docs: https://platform.openai.com/docs/api-reference/assistants
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

def get_client():
    """Initialize OpenAI client with API key from environment."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("❌ Error: OPENAI_API_KEY not found in environment variables.")
        print("   Please copy .env.example to .env and add your API key.")
        sys.exit(1)
    
    org_id = os.getenv("OPENAI_ORG_ID")  # Changed from OPENAI_ORG to match common .env convention
    client_kwargs = {"api_key": api_key}
    if org_id:
        client_kwargs["organization"] = org_id
    
    return OpenAI(**client_kwargs)

def load_assistant_id():
    """Load existing assistant ID from .assistant file if it exists."""
    assistant_file = Path(".assistant")
    if assistant_file.exists():
        return assistant_file.read_text().strip()
    return None

def save_assistant_id(assistant_id):
    """Save assistant ID to .assistant file for reuse."""
    assistant_file = Path(".assistant")
    assistant_file.write_text(assistant_id)
    print(f"💾 Assistant ID saved to {assistant_file}")

def create_or_update_assistant(client):
    """Create a new assistant or update existing one."""
    existing_id = load_assistant_id()
    
    assistant_config = {
        "name": "Practice Lab Assistant",
        "model": "gpt-4-turbo",  # Updated to newer model
        "instructions": """You are a helpful lab assistant for OpenAI API practice sessions.

You can help with:
- Explaining API concepts and responses
- Analyzing uploaded documents using file_search
- Providing structured outputs in JSON format
- Demonstrating various OpenAI API capabilities

Always be clear, concise, and educational in your responses. When working with files, 
provide specific citations and references to the source material.""",
        "tools": [{"type": "file_search"}],
        "temperature": 0.7,
        "top_p": 1.0
    }
    
    try:
        if existing_id:
            print(f"🔄 Updating existing assistant: {existing_id}")
            assistant = client.beta.assistants.update(
                assistant_id=existing_id,
                **assistant_config
            )
            print("✅ Assistant updated successfully!")
        else:
            print("🆕 Creating new assistant...")
            assistant = client.beta.assistants.create(**assistant_config)
            save_assistant_id(assistant.id)
            print("✅ Assistant created successfully!")
        
        print(f"\n📋 Assistant Details:")
        print(f"   ID: {assistant.id}")
        print(f"   Name: {assistant.name}")
        print(f"   Model: {assistant.model}")
        print(f"   Tools: {[tool.type for tool in assistant.tools]}")
        
        return assistant
        
    except Exception as e:
        print(f"❌ Error creating/updating assistant: {e}")
        if "Invalid assistant" in str(e) and existing_id:
            print("⚠️  Existing assistant ID appears invalid. Creating new assistant...")
            assistant = client.beta.assistants.create(**assistant_config)
            save_assistant_id(assistant.id)
            print("✅ New assistant created successfully!")
            return assistant
        sys.exit(1)

def main():
    """Main function to bootstrap the assistant."""
    print("\n🚀 OpenAI Practice Lab - Assistant Bootstrap")
    print("=" * 50)
    
    # Initialize client
    client = get_client()
    print("✅ OpenAI client initialized")
    
    # Create or update assistant
    assistant = create_or_update_assistant(client)
    
    print("\n🎯 Next Steps:")
    print("   1. Run: python scripts/01_responses_api.py")
    print("   2. Or explore other lab modules in the scripts/ directory")
    print("\n💡 Tip: Use 'python scripts/99_cleanup.py' to clean up resources when done")

if __name__ == "__main__":
    main()