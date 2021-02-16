import os

import requests

address = "0.0.0.0"
port = os.getenv("PORT") or os.getenv("$DJANGO_BIND_PORT")

result = requests.get(f"http://{address}:{port}/health-check", timeout=5)

if result.status_code == 200:
    exit(0)
else:
    exit(1)
