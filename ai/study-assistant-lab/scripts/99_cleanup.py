import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

def main():
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    assistant_file = "assistant_info.json"
    if not os.path.exists(assistant_file):
        print("No assistant info found. Nothing to clean up.")
        return
    
    with open(assistant_file, 'r') as f:
        assistant_info = json.load(f)
    
    print("🧹 Starting cleanup...")
    
    if assistant_info.get('vector_store_id'):
        try:
            client.beta.vector_stores.delete(assistant_info['vector_store_id'])
            print(f"✅ Deleted vector store: {assistant_info['vector_store_id']}")
        except Exception as e:
            print(f"⚠️  Could not delete vector store: {e}")
    
    if assistant_info.get('file_id'):
        try:
            client.files.delete(assistant_info['file_id'])
            print(f"✅ Deleted file: {assistant_info['file_id']}")
        except Exception as e:
            print(f"⚠️  Could not delete file: {e}")
    
    try:
        client.beta.assistants.delete(assistant_info['id'])
        print(f"✅ Deleted assistant: {assistant_info['id']}")
    except Exception as e:
        print(f"⚠️  Could not delete assistant: {e}")
    
    try:
        os.remove(assistant_file)
        print(f"✅ Removed {assistant_file}")
    except Exception as e:
        print(f"⚠️  Could not remove {assistant_file}: {e}")
    
    notes_file = "exam_notes.json"
    if os.path.exists(notes_file):
        try:
            os.remove(notes_file)
            print(f"✅ Removed {notes_file}")
        except Exception as e:
            print(f"⚠️  Could not remove {notes_file}: {e}")
    
    print("🎉 Cleanup completed!")

if __name__ == "__main__":
    main()