import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from backend.git_utils import get_uncommitted_files
from backend.file_utils import read_file, write_test_case
from backend.ai_utils import call_ollama, generate_prompt
from backend.test_runner_js import run_test_js
from backend.agent_state import update_status

MAX_RETRIES = 3
THREAD_COUNT = 4


def process_file(repo_path, rel_path, total_files, idx):
    abs_path = os.path.normpath(os.path.join(repo_path, rel_path).strip().replace('\u202a', ''))


    try:
        code = read_file(abs_path)
        update_status(rel_path, status="processing")

    except Exception as e:
        update_status(rel_path, msg=f"❌ Failed to read file: {e}")
        return

    filename = os.path.basename(rel_path)               
    base_name, ext = os.path.splitext(filename)        
    clean_name = base_name
    if clean_name.startswith("test_"):
        clean_name = clean_name[len("test_"):]
    if clean_name.endswith(".test"):
        clean_name = clean_name[:-5]
    test_filename = f"test_{clean_name}.test.js"
    test_file_path = os.path.join(os.path.dirname(abs_path), test_filename)

    previous_test = None
    error_snippet = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            if attempt > 1:
                update_status(rel_path, reset_milestones=True, status="processing")
            update_status(rel_path, milestone="prompt", msg=filename+" : ⚙️ Generating prompt...")
            prompt = generate_prompt(code, rel_path, test_file_path, previous_test, error_snippet)

            update_status(rel_path, milestone="fetch", msg=filename+" : 📦 Fetching test case...")
            test_code = call_ollama(prompt)
            if not test_code.strip():
                raise ValueError("Received empty test code")

            write_test_case(abs_path, test_code)

            update_status(rel_path, milestone="run", msg=filename+" : 🚀 Running test case...")
            success, output = run_test_js(test_file_path)

            if success:
                update_status(rel_path, milestone="success", msg=filename+" : ✅ Test passed", status="success")
                return
            else:
                update_status(rel_path, 
                    msg=f"{filename} : ⚠️ Test failed, retrying ({attempt}/{MAX_RETRIES})",
                    retries=attempt,
                    status="retrying"
                )
                previous_test = test_code
                error_snippet = "\n".join(output.splitlines()[:20])
                time.sleep(1)

        except Exception as e:
            update_status(rel_path, 
                msg=f"❌ Exception: {str(e)}",
                retries=attempt,
                status="failed" if attempt == MAX_RETRIES else "retrying"
            )

    update_status(rel_path, msg=filename+ ": ❌ Failed after 3 retries", status="failed")


def start_generation(repo_path):
    files = get_uncommitted_files(repo_path)
    if not files:
        update_status("global", msg="No uncommitted files found.")
        return

    for f in files:
        update_status(f, status="discovered", progress=0)
    
    update_status("global", msg=f"🔀 Found {len(files)} uncommitted files.")
    
    with ThreadPoolExecutor(max_workers=THREAD_COUNT) as executor:
        futures = [
            executor.submit(process_file, repo_path, f, len(files), idx)
            for idx, f in enumerate(files)
        ]
        for future in as_completed(futures):
            future.result()

    update_status("global", msg="Protocol Completed")