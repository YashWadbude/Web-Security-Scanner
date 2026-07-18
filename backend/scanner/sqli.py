import requests

def scan_sqli(url):
    payload = "' OR '1'='1"
    results = []

    test_url = f"{url}?id={payload}"

    try:
        res = requests.get(test_url, timeout=5)
        errors = ["sql", "syntax", "mysql", "error"]

        if any(e in res.text.lower() for e in errors):
            results.append({
                "type": "SQL Injection",
                "url": test_url,
                "severity": "Critical"
            })
    except:
        pass

    return results