"""
Use this file to generate locations from Google Maps API based on custom 
arguments and save results into json file. Each query costs money so be
careful with arguments being passed through. Set make_query to true to 
run api call (safeguard).

location_keyword - point of interest
location_type - park
"""

import requests
import json
import time
from api_key import api_key

# berkeley = 37.87195477965601, -122.25940259523843 (uc berkeley)
# sf = 37.77629833460745, -122.43232289753016 (painted ladies center)
# boston = 42.37441154118087, -71.11825047972187 (harvard uni)
# sj = 37.36389513009827, -121.92906356810008 (sf mineta airport)
# ucla = 34.069898271226656, -118.4437053386833 (ucla)
# irvine = 33.642330561199024, -117.84159804462422 (uci)
# austin = 30.284846100994397, -97.73414256266427 (ut austin)
# seatle = 47.65461311453359, -122.3074300790595 (uw)
# new york = 40.729298825008286, -73.9965757194589 (ny uni)
# houston = 29.717348432962655, -95.40184586592855 (rice uni)
# chicago = 42.056453569270005, -87.67526759675204 (northwestern uni)
# philadelphia = 39.9521899835553, -75.19325662230598 (upenn)
# miami = 25.7173753713431, -80.2781583850881 (uni of miami)
# stanford = 37.427608139392895, -122.17003810919 (stanford)
# phoenix = 33.41368405684997, -112.01498800182839 (uni of phoenix)
# atlanta = 33.775608786539976, -84.39628502119386 (georgia institute of tech)

# set to true to make query to Google Maps API, 
make_query = False
next_page_token = "AUacShgeW76p1w4iBQKJrbhi7B2_TX5jy_RGIUVMCWDMsYNZLeCs0NOOoZMidipku5VszfvHrfhX_x6BT_V7zNF_EjoCzqdN_v3hXukVNXPS0niMTUkUk4Oy-8J_EvKZ8-UsLTwkF9dwKmKI71W7EW3_xX0S3nFd4kPnMsgJVwAwR81e0kQ4MPRW7NlOVykTCbynREY5EXBD6kKdhp-EXmgpkrrn48NxR58kw-3sujJA8Q1acoh38Te4fiWpvXhi5Ty2dFawu78IC0ADv5hphcrB0elmg1dqDLD91h4ofBA0akdjlUdYpyHOf1S9i8lKUewIZAQcHf-1Myjl8bKl3bgn4rVKXfethwiz953JT8gf00uwMf3-_PXpAnz4SyMSweFNxou9bCn2Pnazi5jCOie0JIak9-K8wtVb1m3MsQ2hriszXf0qTSDx3H5bQYdKg_otxm1PUKQ5G2hoYRC0B6abOZct3FCzuBaY3wKF0ncsdQjUyv4J8H6h3N7HXAO6zjwReV7Q23W07s4pC-ajob8dAPIUlew35F5BcIvJWO0Dk6ZUx5WZGsnqGrv77hlEGzPtSBG48DQDmaAFjc-yrISI3TIrAMh9vSpubqZVWTEIHvhXZdrckhmV-0Ysu0wgYLD3YuDEi4hElw"

# center and radius of Google Maps Nearby Search
radius_miles = 15
latitude = 33.775608786539976
longitude = -84.39628502119386
# location_keyword = "view point"
# location_keyword = "tourist attraction"
location_keyword = "park"

def get_locations_within_radius():
    file_path = f"result-{int(time.time())}.json"
    url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'

    if make_query:
        params = {
            'location': f'{latitude},{longitude}',
            'radius': radius_miles * 1609.34,  # Convert miles to meters
            'keyword': location_keyword,
            'key': api_key,
        }
    else:
        params = {
            "pagetoken": next_page_token,
            "key": api_key
        }

    response = requests.get(url, params=params)
    data = response.json()

    with open(file_path, "w") as file:
        json.dump(data, file, indent=4)

    # print(data)

get_locations_within_radius()



