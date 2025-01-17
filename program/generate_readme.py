import requests
import json
from urllib.parse import urljoin

def generate_readme():
    readme_content = ""
    api_url = "https://global.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&pid=hp&FORM=BEHPTB&uhd=1&uhdwidth=3840&uhdheight=2160&setmkt=zh-CN&setlang=en"
    response = requests.get(api_url)
    response.raise_for_status()
    data = response.json()
    image = data['images'][0]
    readme_content += f"""<div align="center">
<img src="{urljoin("https://bing.com", image['url'])}" alt="Bing Wallpaper for en-US" width="100%">
<em>{image['copyright']}</em><br><br>
</div>"""

    with open("README.md", "w") as f:
        f.write(readme_content)

if __name__ == "__main__":
    generate_readme()
