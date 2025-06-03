import os
import json
import time
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

def create_thread_and_run(client, assistant_id, user_message):
    thread = client.beta.threads.create()
    
    client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=user_message
    )
    
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id
    )
    
    return thread, run

def wait_for_run_completion(client, thread_id, run_id):
    while True:
        run = client.beta.threads.runs.retrieve(
            thread_id=thread_id,
            run_id=run_id
        )
        
        if run.status == "completed":
            return run
        elif run.status == "failed":
            print(f"Run failed: {run.last_error}")
            return run
        elif run.status in ["cancelling", "cancelled", "expired"]:
            print(f"Run {run.status}")
            return run
        
        print(f"Run status: {run.status}... waiting")
        time.sleep(2)

def get_response_and_citations(client, thread_id):
    messages = client.beta.threads.messages.list(thread_id=thread_id)
    
    for message in messages:
        if message.role == "assistant":
            content = message.content[0].text.value
            
            citations = []
            if hasattr(message.content[0].text, "annotations"):
                for annotation in message.content[0].text.annotations:
                    citations.append({
                        "type": annotation.type,
                        "text": annotation.text,
                        "file_citation": getattr(annotation, "file_citation", None)
                    })
            
            return content, citations
    
    return None, []

def main():
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    assistant_file = "assistant_info.json"
    if not os.path.exists(assistant_file):
        print("Assistant not found. Please run the bootstrap script first.")
        return
    
    with open(assistant_file, "r") as f:
        assistant_info = json.load(f)
        assistant_id = assistant_info["id"]
    print(f"Using assistant: {assistant_id}")
    
    print("\n" + "=" * 60)
    print("🤖 TRANSFORMER PAPER Q&A MODE")
    print("=" * 60)
    print("Ask questions about 'Attention Is All You Need'.")
    print("Type 'quit', 'exit', or 'bye' to exit.")
    print("=" * 60)
    while True:
        try:
            user_question = input("\n❓ Your question: ").strip()
            
            if user_question.lower() in ["quit", "exit", "bye"]:
                print("👋 Goodbye!")
                break
                
            if not user_question:
                continue
            
            thread, run = create_thread_and_run(client, assistant_id, user_question)
            completed_run = wait_for_run_completion(client, thread.id, run.id)
            
            if completed_run.status == "completed":
                response, citations = get_response_and_citations(client, thread.id)
                print(f"\n📚 Answer:\n{response}")
                
                if citations:
                    print(f"\n📎 Citations: {len(citations)} found")
                    for citation in citations:
                        print(f"  - {citation}")
            else:
                print(f"❌ Failed to get response: {completed_run.status}")
                
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
