import asyncio, websockets

clients = {}

async def router(ws):
    try:
        async for msg in ws:
            if msg.startswith("register:"):
                name = msg.split(":", 1)[1]
                clients[name] = ws
                print(f"[Server] {name} registered")
                continue

            if msg.startswith("send:"):
                _, target, payload = msg.split(":", 2)
                dest = clients.get(target)
                if dest:
                    await dest.send(payload)
                    print(f"[Server] → {target}")
                else:
                    print(f"[Server] target {target} missing")
            else:
                print(f"[Server] unknown packet {msg[:40]}…")
    finally:
        
        for k, v in list(clients.items()):
            if v == ws:
                del clients[k]
                break

async def main():
    async with websockets.serve(router, "localhost", 8765):
        print("A2A hub on ws://localhost:8765")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
