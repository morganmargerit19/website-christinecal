#!/usr/bin/env python3
"""Extract all unique image URLs referenced in the 2 WordPress XML exports.

Writes sources/wp-extract/image-urls.txt with one URL per line.
Also writes image-mapping.json mapping every attachment's WP id to its URL
so shortcodes like [vc_single_image image="8011"] can be resolved later.
"""
import json
import re
from pathlib import Path
from lxml import etree

ROOT = Path(__file__).resolve().parents[2]
XML_FILES = {
    "eveil-a-soi": ROOT / "sources/christinecal-eveilsoi.WordPress.2026-04-20.xml",
    "eveil-au-soi": ROOT / "sources/christinecal-eveilausoi.WordPress.2026-04-20.xml",
}
OUT_DIR = ROOT / "sources/wp-extract"

NS = {
    "wp": "http://wordpress.org/export/1.2/",
    "content": "http://purl.org/rss/1.0/modules/content/",
    "dc": "http://purl.org/dc/elements/1.1/",
    "excerpt": "http://wordpress.org/export/1.2/excerpt/",
}

IMG_SRC_RE = re.compile(r'<img[^>]+src=["\'](https?://[^"\']+)["\']', re.IGNORECASE)
BG_URL_RE = re.compile(r'url\((https?://[^\)]+)\)', re.IGNORECASE)
VC_SINGLE_IMAGE_RE = re.compile(r'\[vc_single_image[^\]]*image="(\d+)"', re.IGNORECASE)

parser = etree.XMLParser(recover=True, huge_tree=True)

all_urls = set()
id_to_url = {}
referenced_ids = set()

for section, path in XML_FILES.items():
    print(f"Parsing {path.name}...")
    tree = etree.parse(str(path), parser)
    root = tree.getroot()
    channel = root.find("channel")
    for item in channel.findall("item"):
        post_type_el = item.find("wp:post_type", NS)
        post_type = post_type_el.text if post_type_el is not None else ""
        post_id_el = item.find("wp:post_id", NS)
        post_id = post_id_el.text if post_id_el is not None else None
        if post_type == "attachment":
            url_el = item.find("wp:attachment_url", NS)
            if url_el is not None and url_el.text:
                url = url_el.text.strip()
                all_urls.add(url)
                if post_id:
                    id_to_url[post_id] = url
        content_el = item.find("content:encoded", NS)
        if content_el is not None and content_el.text:
            content = content_el.text
            for match in IMG_SRC_RE.finditer(content):
                all_urls.add(match.group(1))
            for match in BG_URL_RE.finditer(content):
                url = match.group(1)
                if re.search(r'\.(jpe?g|png|gif|webp|svg)(\?|$)', url, re.IGNORECASE):
                    all_urls.add(url)
            for match in VC_SINGLE_IMAGE_RE.finditer(content):
                referenced_ids.add(match.group(1))

resolved_from_ids = set()
for rid in referenced_ids:
    if rid in id_to_url:
        url = id_to_url[rid]
        all_urls.add(url)
        resolved_from_ids.add(url)

urls_list = sorted(all_urls)
(OUT_DIR / "image-urls.txt").write_text("\n".join(urls_list) + "\n")
(OUT_DIR / "image-mapping.json").write_text(json.dumps(id_to_url, indent=2))

print(f"\nTotal unique image URLs: {len(urls_list)}")
print(f"  from <img src>:    {len([u for u in urls_list if u not in resolved_from_ids])} approx (includes some dups)")
print(f"  resolved from IDs: {len(resolved_from_ids)}")
print(f"  attachment ids:    {len(id_to_url)}")
print(f"\nWrote:")
print(f"  {OUT_DIR / 'image-urls.txt'}")
print(f"  {OUT_DIR / 'image-mapping.json'}")
