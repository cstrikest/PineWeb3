from flask import Flask, render_template, jsonify, request
import requests, json

token = 'MkMLufsSiHWSKcUIcPzXkdgKQvCNajeIQSCDGPkl'

app = Flask(__name__, template_folder='', static_folder='dist', static_url_path='')

def getById(id):
    info = {}
    info['pos'] = []
    info['title'] = []
    r = requests.get('https://api.discogs.com/releases/{0}?curr_abbr=JPY&token={1}'.format(id, token))
    if not r.ok:
        info['name'] = '{0} NOT FOUND.'.format(id)
    else:
        d = json.loads(r.text)
        info['name'] = d['title'] + ' - ' + d['artists_sort']
        info['jacket_url'] = d['images'][0]['resource_url']
        info['have'] = d['community']['have']
        info['want'] = d['community']['want']
        try:
            info['country'] = d['country']
        except:
            info['country'] = ''
        info['format'] = d['formats'][0]['qty'] + ' x ' + d['formats'][0]['name']
        for s in d['formats'][0]['descriptions']:
            info['format'] += ', ' + s
        info['genre'] = ' '.join(d['genres'])
        try:
            info['style'] = ' '.join(d['styles'])
        except:
            info['style'] = ''
        try:
            info['label'] = d['labels'][0]['name'] + ' - ' + d['labels'][0]['catno']
        except:
            info['label'] = ''
        try:
            info['low'] = d['lowest_price']
        except:
            info['low'] = '0'
        try:
            info['released'] = d['released_formatted']
        except:
            info['released'] = ''
        try:
            info['sells'] = '{0}￥起{1}件在售'.format(str(round(int(d['lowest_price']))), d['num_for_sale'])
        except:
            info['sells'] = '没有在售'
            
        rr = requests.get('https://api.discogs.com/marketplace/price_suggestions/{0}?token=MkMLufsSiHWSKcUIcPzXkdgKQvCNajeIQSCDGPkl&curr_abbr=JPY'.format(id))
        dd = json.loads(rr.text)
        
        try:
            info['M'] = str(round(int(dd['Mint (M)']['value'])))
            info['M-'] = str(round(int(dd['Near Mint (NM or M-)']['value'])))
            info['VG+'] = str(round(int(dd['Very Good Plus (VG+)']['value'])))
            info['VG'] = str(round(int(dd['Very Good (VG)']['value'])))
            info['G+'] = str(round(int(dd['Good Plus (G+)']['value'])))
            info['G'] = str(round(int(dd['Good (G)']['value'])))
            info['F'] = str(round(int(dd['Fair (F)']['value'])))
            info['P'] = str(round(int(dd['Poor (P)']['value'])))
        except:
            info['M'] = '0'
            info['M-'] = '0'
            info['VG+'] = '0'
            info['VG'] = '0'
            info['G+'] = '0'
            info['G'] = '0'
            info['F'] = '0'
            info['P'] = '0'
        
        try:
            for t in d['tracklist']:
                info['pos'].append(t['position'])
                info['title'].append((t['title']))
        except:
            info['pos'] = []
            info['title'] = []
    return info

@app.route("/")
def main():
    return app.send_static_file('index.html')

@app.route("/album", methods = ['POST'])
def getAlbumInfo():
    print("[{0}] album searched.".format(request.form['id']))
    return getById(request.form['id'])