import * as Open from "open";

const places = [
    ['Maddox Park',33.7705084,-84.42674509999999,50,'ChIJ_7NHXaUE9YgRySiKwz0AN28'],
    ['Atlanta Memorial Park',33.8195028,-84.4102711,50,'ChIJnwM3CBQF9YgRd98Wjb5tD6E'],
    ['Laurel Park',33.9486601,-84.57355849999999,50,'ChIJ089Ka9cV9YgR0z0aZ87YPnY'],
    ['Brookhaven Park',33.8645225,-84.3396346,50,'ChIJ40guJ7kI9YgRLyv9EpZAs94'],
    ['Centennial Park',33.8853497,-84.5172732,50,'ChIJIZCe4M0Q9YgRX-UAqA5F7Zs'],
    ['Trammell Crow Park',33.7306149,-84.5531361,50,'ChIJhwAf6O0e9YgROEhMF_awZxQ'],
    ['Bishop Park',33.9044706,-84.5883729,50,'ChIJ5T6AWzQW9YgRG4htEyNE70Q'],
    ['Loring Heights Park',33.7987815,-84.3980596,50,'ChIJLSSfKP8E9YgRMLDsitgkfPs'],
    ['Whittier Mill Park',33.8105045,-84.4851623,50,'ChIJfw8PeVQa9YgRtBavUGljlwo'],
    ['Sandy Springs - Ridgeview Park',33.8969155,-84.3593679,50,'ChIJBcf9S9EO9YgRJe5trX2MJTE'],
    ['Walker Park',33.7467651,-84.3409339,50,'ChIJI-nqC08B9YgR7m1fGkNyHg4'],
    ['Collar Park',33.8142827,-84.6306212,50,'ChIJmScBjPUi9YgRLr0OjTgcKI4'],
    ['Phoenix II Park',33.7358843,-84.38325139999999,50,'ChIJDy22f70D9YgRcvUvU5J8K_A']
];

const pre = "https://www.google.com/maps/place/?q=place_id:"
for (let place of places) {
    const link = `${pre}${place[place.length-1]}`;
    Open.default(link);
};