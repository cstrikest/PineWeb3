from flask import Flask, render_template, jsonify, request
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

app = Flask(__name__, template_folder='', static_folder='dist', static_url_path='')

# 初始化selenium
c = Options()
user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36'
c.add_argument(f'user-agent={user_agent}')
c.add_argument("--headless")
c.add_argument("--disable-gpu")
c.add_argument("--no-sandbox")
c.add_argument("--disable-extensions")
c.add_argument("--window-size=1920,1080")
c.add_argument("--proxy-server='direct://'")
c.add_argument("--proxy-bypass-list=*")
c.add_argument("--start-maximized")
c.add_argument('--disable-dev-shm-usage')
c.add_argument('--ignore-certificate-errors')
c.add_argument('--allow-running-insecure-content')
c.add_argument('log-level=3')
c.page_load_strategy = "eager"
driver = webdriver.Chrome(options = c)

# 专辑信息字典

@app.route("/")
def main():
    return app.send_static_file('index.html')

@app.route("/album", methods = ['POST'])
def getAlbumInfo():
    print("[{0}] album searched.".format(request.form['id']))
    info = {}
    info["pos"] = []
    info["title"] = []
    info["duration"] = []
    try:
        driver.get("https://www.discogs.com/release/" + request.form['id'])
        info["name"] = driver.find_element(By.CLASS_NAME, "title_1q3xW").text
        info_23nnx = driver.find_elements(By.XPATH, """//*[@id="page"]/div/div[2]/div/div[2]/table/tbody/tr/td""")
        info["label"] = info_23nnx[0].text
        info["format"] = info_23nnx[1].text
        info["country"] = info_23nnx[2].text
        info["released"] = info_23nnx[3].text
        info["genre"] = info_23nnx[4].text
        info["style"] = info_23nnx[5].text
        statistics = driver.find_elements(By.XPATH, """//*[@id="release-stats"]/div/div/ul/li/a""")
        info["have"] = statistics[0].text
        info["want"] = statistics[1].text
        info["avg_rating"] = driver.find_element(By.XPATH, """//*[@id="release-stats"]/div/div/ul[1]/li[3]/span[2]""").text
        info["ratings"] = statistics[2].text
        info["low"] = driver.find_element(By.XPATH, """//*[@id="release-stats"]/div/div/ul[2]/li[2]/span[2]""").text
        info["median"] = driver.find_element(By.XPATH, """//*[@id="release-stats"]/div/div/ul[2]/li[3]/span[2]""").text
        info["high"] = driver.find_element(By.XPATH, """//*[@id="release-stats"]/div/div/ul[2]/li[4]/span[2]""").text
        try:
            info["sells"] = driver.find_element(By.XPATH, """//*[@id="release-marketplace"]/div/div[1]/div""").text
        except:
            info["sells"] = "无出售信息"
        info["jacket_url"] = driver.find_element(By.XPATH, """//*[@id="page"]/div/div[2]/div/div[1]/div/a/div/picture/img""").get_attribute("src")
        try:
            track_pos = driver.find_elements(By.CLASS_NAME, "trackPos_2RCje")
            track_title = driver.find_elements(By.XPATH, """//*[@id="release-tracklist"]/div/table/tbody//span[@class="trackTitle_CTKp4"]""")
            track_duration = driver.find_elements(By.CLASS_NAME, "duration_2t4qr")
            for pos in track_pos:
                info["pos"].append(pos.text)
            for title in track_title:
                info["title"].append(title.text)
            for duration in track_duration:
                info["duration"].append(duration.text)
        except:
            pass
    except:
        info = {}
    return info