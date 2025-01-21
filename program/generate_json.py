import requests
import json
from urllib.parse import urljoin

def generate_data_json():
    api_url = f"https://global.bing.com/HPImageArchive.aspx?format=js&mkt=zh-CN&n=1"
    response = requests.get(api_url)
    response.raise_for_status()
    image_data = response.json()['images'][0]
    image_urlbase = urljoin("https://cn.bing.com", image_data['urlbase'])
    copyright = image_data['copyright']
    image_date = image_data['startdate']

    new_entry = {"image_date": image_date, "image_urlbase": image_urlbase, "copyright": copyright}
    filepath = "data/data.json"

    try:
        with open(filepath, "r", encoding='utf-8') as f:
            existing_data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return

    date_exists = any(item.get('image_date') == image_date for item in existing_data)

    if not date_exists:
        existing_data.insert(0, new_entry)

        with open(filepath, "w", encoding='utf-8') as f:
            json.dump(existing_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    generate_data_json()
