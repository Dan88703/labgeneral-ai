import os
import re
from dotenv import load_dotenv
from firecrawl import FirecrawlApp


def fetch_and_clean_with_firecrawl(url: str, api_key: str) -> str:
    print("--- Pobieranie i czyszczenie strony ---")

    app = FirecrawlApp(api_key=api_key)

    scrape_result = app.scrape_url(
        url,
        formats=["markdown"],
        only_main_content=True,
    )

    raw_content = getattr(scrape_result, "markdown", "") or getattr(
        scrape_result, "content", ""
    )

    cleaned_content = re.sub(r"!\[.*?\]\(.*?\)", "", raw_content)

    return cleaned_content


if __name__ == "__main__":
    TARGET_URL = "https://labgeneral.pl"

    load_dotenv()

    api_key = os.getenv("FIRECRAWL_API_KEY")

    if not api_key:
        raise ValueError("FIRECRAWL_API_KEY not found in .env")

    cleaned_content = fetch_and_clean_with_firecrawl(TARGET_URL, api_key)

    print("\n================ PODGLĄD OCZYSZCZONEGO TEKSTU ================\n")
    print(cleaned_content[:2000])
    print("\n==============================================================")

    with open("oczyszczony_tekst.txt", "w", encoding="utf-8") as f:
        f.write(cleaned_content)

    print("\n[+] Zapisano oczyszczony tekst do pliku 'oczyszczony_tekst.txt'")