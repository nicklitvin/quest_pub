
        use db;
        create table locations (
            title varchar(255),
            latitude decimal(10,5),
            longitude decimal(10,5),
            radius decimal(10,5),
            place_id varchar(255) key primary
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

('Elizabeth F. Gamble Garden',37.4400122,-122.1482255,75,'ChIJ0yK_PBm7j4ARbWeM5E9YaJA'),
('Top Of The World',37.4911918,-122.2914428,50,'ChIJNx6mYsGhj4ARthhdWRplPvM'),
('Stanford Oval',37.43014039058879, -122.16936773832909,100,'ChIJqfC_LCq7j4AR_znllQn__5g'),
('Wilcox Solar Observatory',37.40937867596072, -122.16774018162488,100,'ChIJVa235sm6j4ARC2DDkyITGbw'),
('Windy Hill Summit',37.36475455545646, -122.24604991691668,50,'ChIJ-_dODF-vj4AR30Ftb5XYfqM');