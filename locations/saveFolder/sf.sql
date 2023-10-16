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


('Crissy Field',37.8040257,-122.4650165,50,'ChIJVbMlhdyGhYARADaqASKRFVs'),
('Treasure Island View Point',37.8323883,-122.3732796,50,'ChIJG8d-cqKBhYARmPBe6CwpNPs'),
('Telegraph Hill viewpoint',37.80295777105679, -122.40479889574539,50,'ChIJYXcCXGyBhYARhmy-9eDnU0U'),
('The Pier',37.7944776,-122.3897469,50,'ChIJv4ZHEjeBhYARl10l1XIUU9I'),
('Peace Pagoda',37.7850239,-122.4298442,50,'ChIJb8fP0r6AhYARHk9jP9FizCU'),
('Tank Hill',37.7599053,-122.447707,50,'ChIJGTDJF_59j4ARUraPc7mH_cI'),
('Alamo Square',37.7763694,-122.434819,50,'ChIJ5RdoUKWAhYARFfoSJGdFS5c'),
('Mile Rock Beach',37.787582057967334, -122.50605977848947,50, 'ChIJAbkG002GhYARBjBd9qF1AiQ'),
('Hellman Hollow Picnic Area',37.76917816698988, -122.48392313257594,50, 'ChIJWYSTo5iHhYARSUF4j5afF0s'),
('Strawberry Hill',37.7686382855714, -122.47532142099884,50, 'ChIJ6ZjurW6HhYARKAZKC5GoU4Y'),
('Andy Goldsworthy\'s Wood Line', 37.79319389282673, -122.4485966004554, 50, 'ChIJ3QPfEy2HhYARDqnvCZyMPu4'),
('Battery Spencer',37.827771916267174, -122.48169665075659,50, 'ChIJ49V7v4KGhYARhXD1ZWZDXYk'),
('Dolores Park',37.75974978164087, -122.42711110617564,50,'ChIJp3CqeRd-j4ARYI0i8e_kGKY'),
('Christmas Tree Point',37.75491021733938, -122.44662233693421,50,'ChIJKdv69wd-j4ARfLOmz0Qo5nk'),
('16th Avenue Tiled Steps',37.75623245694556, -122.47329124704618,50,'ChIJZbB4wmGHhYAR7dZMVRkEWz0');