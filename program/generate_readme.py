import requests
import json
from urllib.parse import urljoin

def generate_readme():
    readme_content = ""
    api_url = f"https://global.bing.com/HPImageArchive.aspx?format=js&mkt=zh-CN&n=1"
    response = requests.get(api_url)
    response.raise_for_status()
    data = response.json()
    image = data['images'][0]
    readme_content += f"""<div align="center">
<img src="{urljoin("https://cn.bing.com", image['urlbase'] + "_UHD.jpg")}" alt="Bing Wallpaper" width="100%">
<em>{image['copyright']}</em>
</div>"""

    with open("README.md", "w") as f:
        f.write(readme_content)

if __name__ == "__main__":
    generate_readme()
