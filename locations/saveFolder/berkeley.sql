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


('Inspiration Point',37.9054408,-122.2442749,50,'ChIJDT9m3fR7hYARq7sFJLd4Bsk'),
('Shorebird Park Nature Center',37.8616235,-122.3162801,50,'ChIJ6x6F-SF_hYARZwzBYuu1Bvs'),
('Indian Rock Park',37.892185,-122.2726983,50,'ChIJAcK7wax-hYARYxSnYWfJjTA'),
('Emeryville Marina Park',37.8388629,-122.3152083,50,'ChIJR_fvTap_hYARFQi1Hm81Tqk'),
('Big C',37.8745762,-122.2495706,50,'ChIJZXKkyTt8hYARhVTCXYZyJuU'),
('Berkeley Rose Garden',37.88529940000001,-122.2628894,50,'ChIJAXUZGh18hYARe7Uug71u2io'),
('Sunset viewpoint',37.86742209942765, -122.24053737965063, 50, 'ChIJ9TVzWzN9hYARzg1txABaQZA'),
('Berkeley Overlook Vista Point',37.86447962376693, -122.24354193816416,50, 'ChIJQw7jfp99hYARPpRzRqUu7KM'),
('Albany Bulb',37.889785193359735, -122.32468908582257,50,'ChIJ746aXcR4hYARZknGByhzmU0');