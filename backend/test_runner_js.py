import subprocess
import os

def run_test_js(test_file):
    test_dir = os.path.dirname(test_file)
    test_file_name = os.path.basename(test_file)

    print(f"Running command: npx jest {test_file_name} in {test_dir}")
    
    command = [r"C:\Program Files\nodejs\npx.cmd", "jest", test_file_name]

    try:
        result = subprocess.run(
            command,
            cwd=test_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            encoding='utf-8',  
            text=True,
            check=False
        )

        output = (result.stdout or "") + (result.stderr or "")

        if result.returncode != 0:
            print(f"Error executing command! Exit code: {result.returncode}")
            print("Standard Output:", result.stdout)
            print("Standard Error:", result.stderr)

        return result.returncode == 0, output

    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return False, str(e)
