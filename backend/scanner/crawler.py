import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def crawl_website(url):
    visited = set()
    to_visit = [url]
    found_links = []

    while to_visit:
        current_url = to_visit.pop(0)

        if current_url in visited:
            continue

        try:
            response = requests.get(current_url, timeout=5)
            soup = BeautifulSoup(response.text, "html.parser")

            visited.add(current_url)
            found_links.append(current_url)

            for link in soup.find_all("a", href=True):
                full_url = urljoin(url, link['href'])

                if full_url not in visited:
                    to_visit.append(full_url)

        except:
            continue

        if len(found_links) > 15:
            break

    return found_links