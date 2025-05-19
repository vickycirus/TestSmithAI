
import asyncio, json
from collections import defaultdict

status_store = defaultdict(lambda: {
    "status": "pending",
    "progress": 0,
    "retries": 0,
    "milestones": {"prompt": False, "fetch": False, "run": False, "success": False},
    "messages": []
})

event_queue = asyncio.Queue()

def recalc_global_progress():
    file_keys = [k for k in status_store if k != "global"]
    if not file_keys:
        return 0
    
    total = sum(min(f["progress"], 100) for f in status_store.values() if f != status_store["global"])
    return round(total / len(file_keys))

def emit_event(filename):
    """Push the updated state for filename"""
    data = dict(status_store[filename])
    event_type = "file_update" if filename != "global" else "global_update"
    
    event_queue.put_nowait({
        "type": event_type,
        "filename": filename,
        "data": data
    })
    
    if filename != "global":
        global_progress = recalc_global_progress()
        status_store["global"]["progress"] = global_progress
        event_queue.put_nowait({
            "type": "global_update",
            "filename": "global",
            "data": {"progress": global_progress}
        })

def update_status(
    filename,
    milestone=None,
    msg=None,
    retries=None,
    progress=None,
    status=None,
    reset_milestones=False
):
    s = status_store[filename]
    
    if reset_milestones:
        s["milestones"] = {k: False for k in s["milestones"]}
    
    if status:
        s["status"] = status
    
    if progress is not None:
        s["progress"] = progress
    elif milestone:
        order = ["prompt", "fetch", "run", "success"]
        s["milestones"][milestone] = True
        completed = sum(1 for m in order if s["milestones"].get(m, False))
        s["progress"] = min(completed * 25, 100)
    
    if msg:
        s["messages"].append(msg)
    
    if retries is not None:
        s["retries"] = retries
    
    emit_event(filename)

async def get_event_stream(request):
    while True:
        if await request.is_disconnected():
            break
        ev = await event_queue.get()
        yield f"data: {json.dumps(ev)}\n\n"