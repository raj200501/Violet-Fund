import json
from datetime import datetime
from pathlib import Path

import requests
from bs4 import BeautifulSoup

from app.services.embedding import embed_text

SCRAPE_TARGETS = [
    "https://www.sba.gov/funding-programs/grants",
    "https://www.unwomen.org/en/how-we-work/grants",
    "https://www.cartierwomensinitiative.com/",
]

OUTPUT_PATH = Path("/data/opportunities_scraped.json")


def scrape_page(url: str):
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    title = soup.title.text.strip() if soup.title else "Funding Opportunity"
    text = " ".join(soup.get_text(" ", strip=True).split())[:500]
    return {
        "title": title,
        "org": url.split("//")[1].split("/")[0],
        "url": url,
        "funding_type": "grant",
        "amount_text": "See site",
        "deadline": None,
        "eligibility_text": "Refer to source site.",
        "regions": ["Global"],
        "industries": ["General"],
        "stage_fit": ["Seed"],
        "description": text[:200],
        "raw_text": text,
        "source_name": "scrape",
        "embedding": embed_text(text),
        "scraped_at": datetime.utcnow().isoformat(),
    }


def main():
    items = []
    for url in SCRAPE_TARGETS:
        try:
            items.append(scrape_page(url))
        except Exception as exc:
            print(f"Failed to scrape {url}: {exc}")
    OUTPUT_PATH.write_text(json.dumps(items, indent=2))
    print(f"Saved {len(items)} scraped items to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
