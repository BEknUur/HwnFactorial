#!/usr/bin/env python3
"""
99 — Cleanup Script

Delete test threads, files, runs, and other temporary resources to avoid quota bloat.
Helps maintain a clean OpenAI account and manage costs.

Usage: python scripts/99_cleanup.py

Docs: https://platform.openai.com/docs/api-reference
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
    """Initialize OpenAI client with API key from environment."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("❌ Error: OPENAI_API_KEY not found in environment variables.")
        sys.exit(1)
    
    org_id = os.getenv("OPENAI_ORG")
    client_kwargs = {"api_key": api_key}
    if org_id:
        client_kwargs["organization"] = org_id
    
    return OpenAI(**client_kwargs)

def cleanup_threads(client, max_age_hours=24):
    """Clean up old threads created during lab sessions."""
    print("🧹 Cleaning up threads...")
    
    try:
        threads = client.beta.threads.list(limit=100)
        current_time = int(time.time())
        deleted_count = 0
        
        for thread in threads.data:
            # Calculate age in hours
            age_hours = (current_time - thread.created_at) / 3600
            
            if age_hours > max_age_hours:
                try:
                    client.beta.threads.delete(thread.id)
                    print(f"🗑️  Deleted thread: {thread.id} (age: {age_hours:.1f}h)")
                    deleted_count += 1
                except Exception as e:
                    print(f"⚠️  Could not delete thread {thread.id}: {e}")
        
        print(f"✅ Deleted {deleted_count} threads older than {max_age_hours} hours")
        
    except Exception as e:
        print(f"❌ Error cleaning up threads: {e}")

def cleanup_files(client, max_age_hours=24):
    """Clean up uploaded files from lab sessions."""
    print("\n🧹 Cleaning up files...")
    
    try:
        files = client.files.list()
        current_time = int(time.time())
        deleted_count = 0
        
        for file in files.data:
            # Calculate age in hours
            age_hours = (current_time - file.created_at) / 3600
            
            # Only delete files used for assistants (not fine-tuning, etc.)
            if file.purpose == "assistants" and age_hours > max_age_hours:
                try:
                    client.files.delete(file.id)
                    print(f"🗑️  Deleted file: {file.id} ({file.filename}) (age: {age_hours:.1f}h)")
                    deleted_count += 1
                except Exception as e:
                    print(f"⚠️  Could not delete file {file.id}: {e}")
        
        print(f"✅ Deleted {deleted_count} assistant files older than {max_age_hours} hours")
        
    except Exception as e:
        print(f"❌ Error cleaning up files: {e}")

def cleanup_vector_stores(client, max_age_hours=24):
    """Clean up vector stores from lab sessions."""
    print("\n🧹 Cleaning up vector stores...")
    
    try:
        vector_stores = client.beta.vector_stores.list()
        current_time = int(time.time())
        deleted_count = 0
        
        for vs in vector_stores.data:
            # Calculate age in hours
            age_hours = (current_time - vs.created_at) / 3600
            
            if age_hours > max_age_hours:
                try:
                    client.beta.vector_stores.delete(vs.id)
                    print(f"🗑️  Deleted vector store: {vs.id} ({vs.name}) (age: {age_hours:.1f}h)")
                    deleted_count += 1
                except Exception as e:
                    print(f"⚠️  Could not delete vector store {vs.id}: {e}")
        
        print(f"✅ Deleted {deleted_count} vector stores older than {max_age_hours} hours")
        
    except Exception as e:
        print(f"❌ Error cleaning up vector stores: {e}")

def cleanup_assistant(client, keep_assistant=True):
    """Optionally clean up the practice lab assistant."""
    assistant_file = Path(".assistant")
    
    if not assistant_file.exists():
        print("\n📋 No assistant file found - nothing to clean up")
        return
    
    assistant_id = assistant_file.read_text().strip()
    
    if keep_assistant:
        print(f"\n📋 Keeping assistant: {assistant_id}")
        print("   (Use --delete-assistant flag to remove)")
        return
    
    print(f"\n🧹 Cleaning up assistant: {assistant_id}")
    
    try:
        client.beta.assistants.delete(assistant_id)
        assistant_file.unlink()  # Remove the .assistant file
        print("🗑️  Deleted assistant and local reference file")
    except Exception as e:
        print(f"⚠️  Could not delete assistant: {e}")

def cleanup_local_files():
    """Clean up local temporary files created during labs."""
    print("\n🧹 Cleaning up local files...")
    
    temp_files = [
        ".last_thread",
        "data/intro_to_llms.md",
        "data/api_best_practices.md"
    ]
    
    deleted_count = 0
    for file_path in temp_files:
        path = Path(file_path)
        if path.exists():
            try:
                path.unlink()
                print(f"🗑️  Deleted local file: {file_path}")
                deleted_count += 1
            except Exception as e:
                print(f"⚠️  Could not delete {file_path}: {e}")
    
    # Remove empty data directory if it exists
    data_dir = Path("data")
    if data_dir.exists() and not any(data_dir.iterdir()):
        try:
            data_dir.rmdir()
            print("🗑️  Removed empty data directory")
        except Exception as e:
            print(f"⚠️  Could not remove data directory: {e}")
    
    print(f"✅ Cleaned up {deleted_count} local files")

def show_current_usage(client):
    """Display current resource usage for awareness."""
    print("\n📊 Current Resource Usage")
    print("=" * 40)
    
    try:
        # Count threads
        threads = client.beta.threads.list(limit=100)
        print(f"🧵 Threads: {len(threads.data)}")
        
        # Count files
        files = client.files.list()
        assistant_files = [f for f in files.data if f.purpose == "assistants"]
        print(f"📄 Assistant files: {len(assistant_files)}")
        
        # Count vector stores
        vector_stores = client.beta.vector_stores.list()
        print(f"🗂️  Vector stores: {len(vector_stores.data)}")
        
        # Check for assistant
        assistant_file = Path(".assistant")
        if assistant_file.exists():
            assistant_id = assistant_file.read_text().strip()
            print(f"🤖 Assistant: {assistant_id}")
        else:
            print("🤖 Assistant: None")
            
    except Exception as e:
        print(f"❌ Error checking usage: {e}")

def main():
    """Main cleanup function with options."""
    print("🚀 OpenAI Practice Lab - Cleanup")
    print("=" * 50)
    
    # Parse command line arguments
    delete_assistant = "--delete-assistant" in sys.argv
    max_age = 24  # Default to 24 hours
    
    if "--max-age" in sys.argv:
        try:
            age_index = sys.argv.index("--max-age") + 1
            max_age = int(sys.argv[age_index])
        except (IndexError, ValueError):
            print("⚠️  Invalid --max-age value, using default 24 hours")
    
    # Initialize client
    client = get_client()
    
    # Show current usage
    show_current_usage(client)
    
    # Confirm cleanup
    print(f"\n🤔 This will delete resources older than {max_age} hours.")
    if delete_assistant:
        print("⚠️  WARNING: This will also delete the practice assistant!")
    
    confirm = input("Continue? (y/N): ").lower().strip()
    if confirm != 'y':
        print("❌ Cleanup cancelled")
        return
    
    # Perform cleanup
    cleanup_threads(client, max_age)
    cleanup_files(client, max_age)
    cleanup_vector_stores(client, max_age)
    cleanup_assistant(client, keep_assistant=not delete_assistant)
    cleanup_local_files()
    
    print("\n🎯 Cleanup Complete!")
    print("\n💡 Usage Tips:")
    print("   • Run cleanup regularly to manage costs")
    print("   • Use --max-age <hours> to adjust cleanup threshold")
    print("   • Use --delete-assistant to remove the practice assistant")
    print("   • Example: python scripts/99_cleanup.py --max-age 1 --delete-assistant")

if __name__ == "__main__":
    main()