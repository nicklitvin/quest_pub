use db;

create table if not exists locations (
    title varchar(255),
    latitude decimal(10,5),
    longitude decimal(10,5),
    radius decimal(10,5),
    place_id varchar(255),
    primary key (place_id)
);

insert ignore into locations 
(
    title,
    latitude,
    longitude,
    radius,
    place_id
)
values 


('Hunter\'s Point',37.2932152,-122.058491,50,'ChIJVThnfuu0j4AROW1QWdixFf4'),
('Municipal Rose Garden',37.3318809,-121.9286119,50,'ChIJb5KWbRTLj4AR1iYBl5vpNf8'),
('Vieira Park',37.287021,-121.8614271,50,'ChIJ8SaZ26szjoARjT1OeHZsRyE'),
('Willow Glen Holiday Lights',37.3063605,-121.91001,50,'ChIJa6hdFb81joARJwvvHbjGKbE'),
('Historic Murphy Avenue',37.3768095,-122.0301368,50,'ChIJV-q1X1y2j4AR5uXz9JPg4F0'),
('Sunnyvale art corner',37.38090469999999,-122.0275963,50,'ChIJtfWcKY-3j4ARtdTvCAVgSf0'),
('Mission Gardens',37.34876330000001,-121.9415566,50,'ChIJGy6oqK7Lj4ARiXx6DxqavQ4'),
('Boccardo Loop Trail Lookout Point',37.405636848264834, -121.8068764301043,50,'ChIJM3I00XvTj4ARSHlcDtZNxUU'),
('Airpoint Trail',37.44562119564719, -121.85553073453269,50,'ChIJYcWjJlLPj4ARjaXMfy-wlgw'),
('Ulistac Natural Area',37.4038071,-121.9544086,50,'ChIJv6nJp6XJj4AR-Tcwmk2rF9o'),
('San Francisco Bay Trail',37.419494253915914, -122.02020185332661,50,'ChIJM0irUXC3j4AR1FAiME0G8Ew');