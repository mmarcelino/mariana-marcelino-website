"""Prints guide/*.html to assets/*.pdf with headless Chrome (needs the site served
on http://localhost:8765 and Chrome started with --remote-debugging-port=9333)."""
import asyncio, base64, json, os, urllib.request
import websockets

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JOBS = [("guide/guia-pt.html", "assets/guia-8-sinais.pdf"), ("guide/guide-en.html", "assets/guide-8-signs.pdf")]


async def main():
    info = json.loads(urllib.request.urlopen("http://localhost:9333/json").read())
    ws_url = [t for t in info if t.get("type") == "page"][0]["webSocketDebuggerUrl"]
    async with websockets.connect(ws_url, max_size=None) as ws:
        n = 0

        async def send(method, params=None):
            nonlocal n
            n += 1
            await ws.send(json.dumps({"id": n, "method": method, "params": params or {}}))
            while True:
                msg = json.loads(await ws.recv())
                if msg.get("id") == n:
                    return msg

        await send("Page.enable")
        for src, out in JOBS:
            await send("Page.navigate", {"url": f"http://localhost:8765/{src}"})
            await asyncio.sleep(3)
            await send("Runtime.evaluate", {"expression": "document.fonts.ready", "awaitPromise": True})
            r = await send("Page.printToPDF", {"printBackground": True, "preferCSSPageSize": True, "marginTop": 0, "marginBottom": 0, "marginLeft": 0, "marginRight": 0})
            open(os.path.join(ROOT, out), "wb").write(base64.b64decode(r["result"]["data"]))
            print("wrote", out)

asyncio.run(main())
