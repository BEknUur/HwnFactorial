import asyncio, os, websockets
from dotenv import load_dotenv
from pydantic_ai import Agent

load_dotenv()
os.makedirs("logs", exist_ok=True)

reviewer = Agent(
    "google-gla:gemini-1.5-flash",
    system_prompt="""
You are Buddy-Check, a meticulous travel expert.
Return either:

✅ **APPROVED** – if itinerary is realistic and follow-up applied  
🔧 **REWRITE NEEDED** – with numbered fixes if there are issues

Finish with one practical pro-tip. ≤ 30 lines, Markdown.
"""
)

async def run_review(itin: str):
    return await reviewer.run(itin)

async def main():
    async with websockets.connect("ws://localhost:8765") as ws:
        await ws.send("register:reviewer")
        print("[Reviewer] ready")

        while True:
            itinerary = await ws.recv()
            print("[Reviewer] itinerary received")

            fb = await run_review(itinerary)
            msg = fb.output
            await ws.send(f"send:user:{msg}")

          
            with open("logs/result.log", "a", encoding="utf-8") as f:
                f.write("\n=== Itinerary ===\n" + itinerary +
                        "\n=== Feedback ===\n" + msg + "\n")

if __name__ == "__main__":
    asyncio.run(main())
