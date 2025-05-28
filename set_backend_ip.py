# set_backend_ip.py
import socket
import json
import os

# Point to the app.json inside the frontend folder
APP_JSON_PATH = os.path.join(os.path.dirname(__file__), "frontend", "app.json")

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("10.255.255.255", 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = "127.0.0.1"
    finally:
        s.close()
    return IP

def update_app_json(ip):
    if not os.path.exists(APP_JSON_PATH):
        print(f"❌ app.json not found at: {APP_JSON_PATH}")
        return

    with open(APP_JSON_PATH, "r") as f:
        data = json.load(f)

    data.setdefault("expo", {}).setdefault("extra", {})["BACKEND_URL"] = f"http://{ip}:8000"

    with open(APP_JSON_PATH, "w") as f:
        json.dump(data, f, indent=2)

    print(f"✅ Updated frontend/app.json with BACKEND_URL = http://{ip}:8000")

if __name__ == "__main__":
    ip = get_local_ip()
    update_app_json(ip)
