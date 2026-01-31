from __future__ import annotations

import re
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

MAX_CHARS = 6000


def fetch_url_text(url: str) -> dict[str, str]:
    try:
        response = requests.get(
            url,
            timeout=8,
            headers={"User-Agent": "VioletFundCopilot/1.0"},
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise ValueError(f"Unable to fetch URL: {exc}") from exc

    soup = BeautifulSoup(response.text, "html.parser")
    title = ""
    if soup.title and soup.title.string:
        title = soup.title.string.strip()

    description = ""
    meta_desc = soup.find("meta", attrs={"name": "description"})
    if meta_desc and meta_desc.get("content"):
        description = meta_desc["content"].strip()

    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()

    raw_text = soup.get_text(" ", strip=True)
    raw_text = re.sub(r"\s+", " ", raw_text).strip()
    if len(raw_text) > MAX_CHARS:
        raw_text = raw_text[:MAX_CHARS].rsplit(" ", 1)[0]

    parsed = urlparse(url)
    org = parsed.netloc.replace("www.", "").strip()

    return {
        "title": title or "Untitled opportunity",
        "org": org or "Unknown organization",
        "raw_text": raw_text,
        "description": description,
    }
