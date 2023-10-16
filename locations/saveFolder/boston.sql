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


('Public Garden',42.3540639,-71.0700921,50,'ChIJu2Argp5w44kRAecWXgt_18s'),
('Charles River Esplanade',42.3556187,-71.0788876,50,'ChIJv9lnBgp644kRes_e1eIVHvA'),
('Wright\'s Tower',42.4327042,-71.10489559999999,50,'ChIJDaJ8Fal244kRRmGHJmWzIzU'),
('North Point Park',42.36901599999999,-71.0690224,50,'ChIJ_fz6HpRw44kRc60n7gmu5tw'),
('Harvard Square',42.3732168,-71.1202181,50,'ChIJecplvEJ344kRdjumhjIYylk'),
('Faneuil Hall Marketplace',42.360189,-71.0551145,50,'ChIJpyiwa4Zw44kRBQSGWKv4wgA'),
('Harborwalk Lookout Terrace',42.354722,-71.044459,50,'ChIJi8i90wxx44kRmSbB2MZ0Xw0'),
('M Street Beach',42.3300643129627, -71.03140587286778,50,'ChIJdaHHkZR644kRoj09Zb62RBw'),
('LoPresti Park',42.370155005639084, -71.04363968334384,50,'ChIJYZCJ4l1w44kRJepl5BZnZpQ'),
('James P. Kelleher Rose Garden',42.34194722284435, -71.09492166272466,50,'ChIJq9vVrB9644kRFIkWw3hiqfE'),
('Graffiti Alley',42.36500219203066, -71.1021594933944,50,'ChIJ6yoO91N344kRgJcRiIekXaw');

