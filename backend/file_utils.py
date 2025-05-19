from pathlib import Path
import re
def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def write_test_case(source_path, test_code):
    cleaned_test_code = '\n'.join(
        line for line in test_code.splitlines() 
        if not re.search(r"fixed|Here.*fixed|Here.*version", line, re.IGNORECASE) and line.strip() != ""
    )

    test_path = Path(source_path)
    test_file = test_path.parent / f"test_{test_path.stem}.test.js"
    
    with open(test_file, "w", encoding="utf-8") as f:
        f.write(cleaned_test_code)
    
    return str(test_file)  