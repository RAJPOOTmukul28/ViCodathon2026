import json
from pathlib import Path


MEMORY_FILE = Path(__file__).resolve().parent.parent / "data" / "memory.json"


def load_memory():
    if not MEMORY_FILE.exists():
        return []

    try:
        with open(MEMORY_FILE, "r", encoding="utf-8") as file:
            return json.load(file)
    except Exception:
        return []


def save_memory(item):
    MEMORY_FILE.parent.mkdir(parents=True, exist_ok=True)

    memory = load_memory()
    memory.append(item)

    with open(MEMORY_FILE, "w", encoding="utf-8") as file:
        json.dump(memory, file, indent=2, ensure_ascii=False)


def already_covered(topic):
    memory = load_memory()

    topic_text = topic.lower()

    for item in memory:
        previous_topic = item.get("topic", "").lower()

        if previous_topic == topic_text:
            return True

    return False