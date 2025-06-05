import asyncio, websockets

async def cli():
    async with websockets.connect("ws://localhost:8765") as ws:
        await ws.send("register:user")
        print("🔹 Connected to Travel-Buddy")

        while True:
            txt = input("\n📝 Trip query / follow-up (Enter = quit): ").strip()
            if not txt:
                break

            await ws.send(f"send:planner:{txt}")
            reply = await ws.recv()
            print("\n💡 Reply:\n" + reply)

if __name__ == "__main__":
    asyncio.run(cli())
