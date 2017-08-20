from flask import Flask, request, jsonify, render_template
import requests
import random
from pprint import pprint
app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')

r1 = False
r2 = False
r3 = False
count = 0


@app.route('/status')
def status():
    global r1, r2, r3, count
    status = {"r1": r1, "r2": r2, "r3": r3}
    if r1 or r2 or r3:
        count += 1
        if count == 7:
            count = 0
            r1 = False
            r2 = False
            r3 = False

    return jsonify(status)


@app.route('/compute', methods=['POST'])
def compute():
    global r1, r2, r3
    data = request.get_json()
    source_lat = float(data['slat'])
    source_lng = float(data['slng'])
    target_lat = float(data['tlat'])
    target_lng = float(data['tlng'])

    # Fetch s-t directions.
    res = fetch_directions(source_lat, source_lng,
                           target_lat, target_lng)
    step = closest_step(res, source_lat, source_lng)

    # Match leg information to best rotulo option.
    color = choose_color(step, source_lat, source_lng,
                         target_lat, target_lng)
    if color == 'red':
        r1 = True
    elif color == 'blue':
        r2 = True
    else:
        r3 = True

    # TODO: Send color to rid arduino.
    return jsonify({"success": color})


GMAPS_API_BASE_URL = 'https://maps.googleapis.com/maps/api/directions/json'
BAYAMON_NORTE = '18.400343,-66.1537886'
START = '18.3946723,-66.1534051'
POST_OFFICE = '18.393074,-66.1564493'
BAMBU_BURGER = '18.389086,-66.1469315'
SOCCER_COMPLEX = '18.3662922,-66.1664379'


def fetch_directions(slat, slng, tlat, tlng):
    params = {
        'origin': '%f,%f' % (slat, slng),
        'destination': '%f,%f' % (tlat, tlng),
        'key': 'AIzaSyBvBOU2OZf99JCYlWTkoQzL0R0tFR_OHV8'
    }
    res = requests.get(GMAPS_API_BASE_URL, params)
    return res.json()


def closest_step(gmaps_res, slat, slng):
    routes = gmaps_res['routes']
    first_route = routes[0]
    legs = first_route['legs']
    first_leg = legs[0]
    steps = first_leg['steps']
    pprint(steps)
    print len(steps)
    return None


def choose_color(step, slat, slng, tlat, tlng):
    print tlat, tlng
    if tlat == 18.3930741 and tlng < -66.156:  # postal
        return 'yellow'
    elif tlat == 18.3890864 and tlng == -66.1469315:  # bambu
        return 'red'
    elif tlat == 18.3953444 and tlng == -66.1526101:  # engine
        return 'blue'
    else:
        print 'wooops', tlat, tlng, type(tlng),
        tlat == 18.3930741,
        tlng == -66.1564493, tlng, -66.1564493
    # if step yields right polyline,
    # elsif step yields left polyline, ect...
    return 'green'
