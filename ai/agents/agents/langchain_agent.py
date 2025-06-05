from dotenv import load_dotenv
load_dotenv()

import asyncio
import websockets
from langchain_openai import ChatOpenAI

SYSTEM_PROMPT = """
You are Travel-Buddy, an expert itinerary planner.
Produce a clear, day-by-day plan in Markdown:
• Headings “Day 1”, “Day 2”, …  
• 3-4 activities per day, balanced by theme/time  
• End with a short checklist of tickets/reservations.

If you receive an *existing itinerary* inside <itinerary> … </itinerary>
and a *follow-up request* inside <followup> … </followup>,
merge the change, touching only the affected parts.
"""

async def planner():
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

    async with websockets.connect("ws://localhost:8765") as ws:
        await ws.send("register:planner")
        print("[Planner] waiting for tasks…")

        while True:
            req = await ws.recv()
            print(f"[Planner] task ⇢\n{req}\n")

            prompt = f"{SYSTEM_PROMPT}\n\nUser request:\n{req}"
            itinerary_md = llm.invoke(prompt)

            await ws.send(f"send:reviewer:{itinerary_md}")
            print("[Planner] itinerary sent to reviewer")

if __name__ == "__main__":
    asyncio.run(planner())
