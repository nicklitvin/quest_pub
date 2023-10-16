
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


('875 North Michigan Avenue',41.8987699,-87.6229168,50,'ChIJNbKQElTTD4gR0JKC0nXHXWg'),
('Riverwalk',41.8884124,-87.62262679999999,50,'ChIJX-RTBqksDogRRh_Q4ynbf_8'),
('Nicholas J. Melas Centennial Fountain',41.8891886,-87.6181508,50,'ChIJjdRoFFYrDogRz2dolVQVQ0c'),
('Navy Pier',41.8918633,-87.6050944,100,'ChIJ2y7xkU0rDogR3KSIsJbbrNA'),
('Shakespeare Garden',42.0568586,-87.67598319999999,50,'ChIJjWdar5_aD4gReDf1XjS9M60'),
('North Park Village Nature Center',41.988015,-87.7243015,200,'ChIJbdzp8XHOD4gR8bihpV9b1lA'),
('Gillson Park',42.0787016,-87.6866202,200,'ChIJufVEYcbaD4gRNpsbrmLceFM'),
('AIDS Memorial Meditation Point',41.9848005,-87.650292,50,'ChIJu5zUXeDRD4gR5ixwaQpF5ic'),
('Montrose Moonrise Observation Point One',41.959938,-87.63883969999999,100,'ChIJMRonSJ_TD4gRzT0yzWNympw'),
('Ohio Street Beach',41.89359490050037, -87.61252028127427,100,'ChIJwR5paVMrDogRhMIXATY07a4'),
('Millenium Park',41.88254241527682, -87.62255408213207,200,'ChIJA5xPiqYsDogRBBCptdwsGEQ'),
('The Concrete Beach',41.90517346452913, -87.62414584095367,100,'ChIJFyWDEFrTD4gRhlBtLqPgeMg'),
('Chicago Botanic Garden',42.14603465720447, -87.78976148551857,300,'ChIJ-VSaNEPBD4gRKyqG8-_zd5Y');