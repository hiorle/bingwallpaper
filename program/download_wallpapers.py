import requests
import json
import os
from urllib.parse import urljoin

MARKETS = ["en-US", "zh-CN", "ja-JP", "en-IN", "pt-BR", "en-CA"]
OUTPUT_DIR = "wallpaper"

def download_wallpaper(market):
    country = market.split('-')[1].lower()
    api_url = f"https://global.bing.com/HPImageArchive.aspx?format=js&mkt={market}&n=1"
    response = requests.get(api_url)
    response.raise_for_status()

    image_data = response.json()['images'][0]
    date = image_data['startdate']
    full_image_url = urljoin("https://bing.com", image_data['urlbase'] + "_UHD.jpg")

    output_filename = os.path.join(OUTPUT_DIR, f"{date}{country}.jpg")

    image_response = requests.get(full_image_url, stream=True)
    image_response.raise_for_status()

    with open(output_filename, 'wb') as f:
        for chunk in image_response.iter_content(chunk_size=8192):
            f.write(chunk)

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for market in MARKETS:
        download_wallpaper(market)
