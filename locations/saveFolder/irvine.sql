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


('North Lake Island',33.681304845353814, -117.79496259097164,50,'ChIJ44CB_Zzd3IAR1AmHjWs8TpE'),
('Viewpoint',33.5848964,-117.8352575,50,'ChIJQZ-J-l7h3IARdhlT7lHlWLk'),
('View point and beach access (stairs!)',33.5801927,-117.8535806,50,'ChIJWehXZXvh3IARBattjg4CTEY'),
('Vista Point',33.6303909,-117.824255,50,'ChIJPSfJQ1Hn3IARLXSA_Kr-B6g'),
('Crescent Bay Point Park',33.5469033,-117.8038219,50,'ChIJR8Tg7zzk3IARR_J_oelN7QU'),
('West Jetty View Park',33.5955665,-117.8818277,50,'ChIJD_CEPVng3IARST0KxU3ekrw'),
('Heisler Park',33.5434011,-117.7901115,50,'ChIJgy0edjbk3IARjYy8AqJmAxU'),
('Irvine Spectrum Center Giant Wheel',33.6494132,-117.7426976,50,'ChIJpf9mevzn3IARhS2npw3bbIY'),
('Goldenrod Footbridge',33.5980541,-117.8755385,50,'ChIJcxpYefbg3IARX-XRhM5QUOA'),
('John Wayne Park',33.6204979,-117.920386,50,'ChIJ458Qc_nf3IARLAleIAjb5bY'),
('Grand Park',33.5750416,-117.7272015,50,'ChIJ62g2ZlLv3IARIeW1hQrow24');