import requests
import re
from pathlib import Path
import os



def fix_imports(js_code):
    js_code = re.sub(
        r'import\s+([\w{}\s,*]+)\s+from\s+[\'"](.+?)[\'"];?',
        r'const \1 = require("\2");',
        js_code
    )
    js_code = re.sub(r'export\s+', '', js_code)
    return js_code

def extract_code_block(text):
    match = re.search(r"```(?:js|javascript)?\s*(.*?)```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()  


def call_ollama(prompt, model="codellama:7b"):
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()

        if "response" not in data:
            print("❌ Ollama error:", data.get("error", "Unknown error"))
            return ""

        code = extract_code_block(data["response"])
        return fix_imports(code)

    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Ollama at http://localhost:11434")
        return ""
    except Exception as e:
        print(f"❌ Unexpected error from Ollama: {e}")
        return ""

def generate_prompt(source_code, source_path, test_path, previous_test=None, error_output=None):

    source_file = Path(source_path)
    print("source file name")
    print(source_file.name)
    relative_import = "./"+ source_file.name
    prompt = (
        f"You are an expert JavaScript test writer.\n"
        f"Write a complete Jest unit test for `{source_file.name}`.\n"
        f"Use `require('{relative_import}')` to import it.\n"
        f"Respond with only code. No explanations.\n\n"
        f"Source code:\n\n{source_code}\n\n"
    )
    if previous_test and error_output:
        prompt += (
            f"The previous test failed with the following error:\n"
            f"{error_output}\n\n"
            f"Here is the failed test code:\n{previous_test}\n\n"
            f"Fix the test so it passes. Ensure no syntax or import issues."
            f"Respond with only code. No explanations.\n\n"
        )
        print(prompt)
    return prompt
