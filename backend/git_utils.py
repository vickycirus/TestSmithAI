import subprocess
import os
def get_uncommitted_files(repo_path):
    repo_path = os.path.normpath(repo_path)
    repo_path = os.path.normpath(repo_path.strip().replace('\u202a', ''))
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain", "--untracked-files=all"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            check=True
        )
        lines = result.stdout.strip().splitlines()
        files = [line[3:] for line in lines if line and line[0] in {"M", "A", "?"}]
        return [f for f in files if f.endswith((".js", ".java"))]
    except subprocess.CalledProcessError as e:
        print("❌ Git command failed:", e.stderr)
        return []
    except FileNotFoundError:
        print("❌ Invalid path or Git not installed.")
        return []
