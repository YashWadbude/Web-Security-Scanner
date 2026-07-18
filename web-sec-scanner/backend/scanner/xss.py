import requests

def scan_xss(url):
    payload = "<script>alert(1)</script>"
    results = []

    test_url = f"{url}?q={payload}"

    try:
        res = requests.get(test_url, timeout=5)

        if payload in res.text:
            results.append({
                "type": "XSS",
                "url": test_url,
                "severity": "High"
            })
    except:
        pass

    return results