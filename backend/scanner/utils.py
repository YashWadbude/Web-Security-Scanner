import requests

COMMON_DIRS = ["admin", "login", "dashboard", "uploads", "config"]

def scan_directories(base_url):
    results = []

    for d in COMMON_DIRS:
        url = f"{base_url}/{d}"

        try:
            res = requests.get(url, timeout=3)

            if res.status_code == 200:
                results.append({
                    "type": "Exposed Directory",
                    "url": url,
                    "severity": "Medium"
                })
        except:
            continue

    return results