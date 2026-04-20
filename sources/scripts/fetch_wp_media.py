#!/usr/bin/env python3
"""Download every image URL listed in sources/wp-extract/image-urls.txt.

Each URL is saved under assets/images/wp/<host-slug>/<original-path>, mirroring
the original WordPress /wp-content/uploads/YYYY/MM/ layout so cleanup scripts
can easily rewrite references later.

The script is idempotent: files already present on disk are skipped. Failed
downloads are logged and counted but don't abort the run (WordPress sites
often have a few 404s after plugin cleanup).

Designed to be invoked from a GitHub Actions runner where the WP hosts are
reachable — the Claude Code sandbox blocks outbound HTTP via an allowlist.
"""
from __future__ import annotations

import sys
import time
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

ROOT = Path(__file__).resolve().parents[2]
URL_LIST = ROOT / "sources/wp-extract/image-urls.txt"
OUT_DIR = ROOT / "assets/images/wp"

HOST_SLUGS = {
    "coach.christkal5d.com": "coach-christkal5d",
    "www.christinecal-coach-quantique.com": "coach-quantique",
}

USER_AGENT = (
    "Mozilla/5.0 (compatible; christinecal-media-rehydration/1.0; "
    "+https://www.christinecal.com)"
)

MAX_RETRIES = 3
BACKOFF_BASE = 2  # seconds


def target_for(url: str) -> Path:
    parsed = urlparse(url)
    slug = HOST_SLUGS.get(parsed.netloc, parsed.netloc.replace(".", "-"))
    path = parsed.path.lstrip("/")
    if path.startswith("wp-content/uploads/"):
        path = path[len("wp-content/uploads/"):]
    return OUT_DIR / slug / path


def download(url: str, dest: Path) -> tuple[bool, str]:
    if dest.exists() and dest.stat().st_size > 0:
        return True, "skipped (exists)"
    dest.parent.mkdir(parents=True, exist_ok=True)
    last_err = ""
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            req = Request(url, headers={"User-Agent": USER_AGENT})
            with urlopen(req, timeout=30) as resp:
                data = resp.read()
            if not data:
                last_err = "empty response"
                continue
            dest.write_bytes(data)
            return True, f"{len(data):,} B"
        except HTTPError as e:
            last_err = f"HTTP {e.code}"
            if e.code in (404, 410, 403):
                return False, last_err
        except (URLError, TimeoutError, OSError) as e:
            last_err = str(e)
        if attempt < MAX_RETRIES:
            time.sleep(BACKOFF_BASE ** attempt)
    return False, last_err


def main() -> int:
    if not URL_LIST.exists():
        print(f"ERROR: {URL_LIST} not found — run extract_image_urls.py first.", file=sys.stderr)
        return 1
    urls = [u.strip() for u in URL_LIST.read_text().splitlines() if u.strip()]
    print(f"Rehydrating {len(urls)} WordPress images -> {OUT_DIR.relative_to(ROOT)}")
    ok = skipped = failed = 0
    failures: list[tuple[str, str]] = []
    for i, url in enumerate(urls, 1):
        dest = target_for(url)
        success, note = download(url, dest)
        if success and note.startswith("skipped"):
            skipped += 1
            status = "SKIP"
        elif success:
            ok += 1
            status = "OK  "
        else:
            failed += 1
            failures.append((url, note))
            status = "FAIL"
        print(f"[{i:3d}/{len(urls)}] {status} {note:>14}  {url}")
    print()
    print(f"Summary: ok={ok}  skipped={skipped}  failed={failed}  total={len(urls)}")
    if failures:
        print("\nFailed URLs:")
        for url, reason in failures:
            print(f"  [{reason}] {url}")
    # Always return 0 — individual download failures are logged but must not
    # kill the workflow, otherwise the commit step never runs and we can't
    # observe what happened. A true fatal error (missing URL list) already
    # returned early above.
    return 0


if __name__ == "__main__":
    sys.exit(main())
