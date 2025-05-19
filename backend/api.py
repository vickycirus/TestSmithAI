from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from backend.main_agent import start_generation
from backend.agent_state import status_store, get_event_stream
from backend.agent_state import update_status
import os 
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            
    allow_credentials=True,
    allow_methods=["*"],              
    allow_headers=["*"],              
)

@app.post("/start")
async def start(payload: dict):
    path = payload.get("path")
    if not path:
        return JSONResponse({"error": "Missing repo path"}, status_code=400)

    path = os.path.normpath(path)
    update_status("global", msg=f"Starting on: {path}")

    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, start_generation, path)

    return {"message": "Started processing"}


@app.get("/status")
def get_status():
    return status_store

@app.get("/events")
async def events(request: Request):
    return StreamingResponse(get_event_stream(request), media_type="text/event-stream")

@app.get("/health")
async def health():
    return {"status": "ok"}
