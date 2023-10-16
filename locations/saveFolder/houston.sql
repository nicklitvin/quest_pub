
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


('Smither Park',29.7167608,-95.3246374,50,'ChIJoW24imW-QIYRfVx2CeQVEa0'),
('Waterwall',29.7357404,-95.46131539999999,50,'ChIJoercd0rBQIYRv6PeqprblKQ'),
('Market Square Park',29.7626451,-95.36236079999999,50,'ChIJ84Jv4S-_QIYRrPnSA2Vagik'),
('Robinson Road Lights',29.5719837,-95.5476358,50,'ChIJvYElhPHvQIYRWATfAiiI2VE'),
('Eleanor Tinsley Park',29.7622761,-95.3792185,150,'ChIJZRhNaU-_QIYRV5P2J_E0O-8'),
('McGovern Garden Falls',29.7214793,-95.38787409999999,50,'ChIJU9zZrqi_QIYRCveD-2P4nGg'),
('Mason Park',29.725706197904493, -95.2939013268109,200,'ChIJA7oWSsu9QIYRfYrBk3KewbQ');
    