import requests

def scan_headers(url):
    results = []

    try:
        res = requests.get(url, timeout=5)
        headers = res.headers

        if "Content-Security-Policy" not in headers:
            results.append({
                "type": "Missing CSP Header",
                "url": url,
                "severity": "Medium"
            })

        if "X-Frame-Options" not in headers:
            results.append({
                "type": "Clickjacking Risk",
                "url": url,
                "severity": "Medium"
            })

    except:
        pass

    return results