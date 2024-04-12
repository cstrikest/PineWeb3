import pygame
import urllib.request
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

# 初始化pygame
pygame.init()
clock = pygame.time.Clock()
width = 1000
height = 700
window = pygame.display.set_mode((width, height))
pygame.display.set_caption("DisCogs Viewer")
pygame.scrap.init()
welcome = True
loading = False
failed = False
font_genei = pygame.font.Font("./fonts/genei-pople.ttf", 20)
font_doki = pygame.font.Font("./fonts/DokiDokiFantasia.otf", 43)
font_natsumi = pygame.font.Font("./fonts/natsuzemi-maru-gothic-black.ttf", 30)
font_spoqa = pygame.font.Font("./fonts/SpoqaHanSansJPRegular.ttf", 16)
font_spoqa2 = pygame.font.Font("./fonts/SpoqaHanSansJPRegular.ttf", 28)
font_yaheib = pygame.font.FontType("./fonts/msyhbd.ttc", 14)
font_yahei = pygame.font.FontType("./fonts/msyh.ttc", 16)

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
c.page_load_strategy = "eager"
driver = webdriver.Chrome(options = c)

# 专辑信息字典
info = {}
info["pos"] = []
info["title"] = []
info["duration"] = []
current_id = ""

# 从剪贴板获取discogs专辑号 获取失败返回""
def getClipboardId():
    try:
        for t in pygame.scrap.get_types():
            if "text" in t:
                id = pygame.scrap.get(pygame.SCRAP_TEXT)
        return "".join(c for c in id.decode("utf-8") if c.isdigit())
    except:
        return ""

# 抓取专辑信息
def getInfo(album_id):
    try:
        driver.get("https://www.discogs.com/release/" + album_id)
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
        return False
    except:
        return True

# pygame主程序循环
while True:
    window.fill((0, 0 ,0))
    if loading:
        welcome_title = font_spoqa2.render("加载信息中...", True, (255, 255, 255), None)
        window.blit(welcome_title, (14, 20))
        pygame.display.flip()
        failed = getInfo(getClipboardId())
        current_id = id
        loading = False
        welcome = False
    elif failed:
        welcome_title = font_spoqa2.render("无法从{}中获取信息".format(id), True, (255, 255, 255), None)
        window.blit(welcome_title, (14, 20))
    elif welcome:
        welcome_title = font_spoqa2.render("双击discogs页面右上Release编号后按Enter显示专辑信息", True, (255, 255, 255), None)
        window.blit(welcome_title, (14, 20))
    else:
        name_render = font_natsumi.render(info["name"], True, (255, 255, 255), None)
        x, y = name_render.get_size()
        if x > width:
            y = y /(x / (width - 25))
            name_render = pygame.transform.scale(name_render, (width - 25, y))
        
        window.blit(name_render, (14, 20))
        window.blit(font_spoqa.render("厂牌: " + info["label"], True, (255, 255, 255), None), (8, 75))
        window.blit(font_spoqa.render("媒体形式: " + info["format"], True, (255, 255, 255), None), (8, 95))
        window.blit(font_spoqa.render("发行地: " + info["country"], True, (255, 255, 255), None), (8, 115))
        window.blit(font_spoqa.render("发行日期: " + info["released"], True, (255, 255, 255), None), (8, 135))
        window.blit(font_spoqa.render("分类: " + info["genre"], True, (255, 255, 255), None), (8, 155))
        window.blit(font_spoqa.render("风格: " + info["style"], True, (255, 255, 255), None), (8, 175))

        window.blit(font_yaheib.render("Discogs数据中," + info["have"] + "人持有," + info["want"] + "人想要", True, (255, 255, 255), None), (8, 201))
        window.blit(font_yaheib.render("共" + info["ratings"] + "人打分:  " + info["avg_rating"], True, (255, 255, 255), None), (8, 217))
        window.blit(font_yaheib.render("最低价: " + info["low"] + "  平均价: " + info["median"] + "  最高价: " + info["high"], True, (255, 255, 255), None), (8, 233))
        window.blit(font_yaheib.render(info["sells"], True, (255, 255, 255), None), (8, 249))

        if len(info["title"]) > 0:
            for i in range(0, len(info["title"])):
                window.blit(font_yahei.render(info["pos"][i] , True, (255, 255, 255), None), (325, 300 + (i * 20)))
                window.blit(font_yahei.render(info["title"][i] , True, (255, 255, 255), None), (365, 300 + (i * 20)))

        try:
            urllib.request.urlretrieve(info["jacket_url"], "./jacket.jpeg")
            img = pygame.image.load("./jacket.jpeg").convert()
            img = pygame.transform.scale(img, (300, 300))
            window.blit(img, (3, 300))
        except:
            window.blit(font_natsumi.render("无法获取封面图片", True, (222, 222, 222), None), (20, 300))

    pygame.display.flip()
    clock.tick(10)
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            driver.quit()
            exit()
        if(event.type == pygame.KEYDOWN):  # 键盘输入响应
            if(event.key == pygame.K_RETURN):
                id = getClipboardId()
                if id != "" and current_id != id:
                    welcome = False
                    loading = True