
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


('Arizona Canal South Bridge',33.4995956,-111.928384,50,'ChIJxZGo8ZsLK4cRgT0qa-1GpoY'),
('Hole in the Rock',33.4564869,-111.9452606,50,'ChIJdWuhyFEJK4cRLczqrQDbWAU'),
('Observation Point',33.3520534,-112.0142388,50,'ChIJ21tS_dkFK4cR0DOJMUW_Wqs'),
('National Trail Lookout',33.3271496,-112.0749584,50,'ChIJm4vqRSIbK4cR0964EMaPVCI'),
('Lookout Mountain Preserve',33.6292268,-112.0481259,50,'ChIJNau0mQFuK4cR1s84Cda_jbM'),
('Fountain Hills Viewing Point',33.579925,-111.759097,50,'ChIJB7VZUAKiK4cRBMbJDX3hj2U'),
('Piestewa Peak Trailhead',33.539613126523406, -112.02283784092114,50,'ChIJCzyevMpyK4cRdpZYQ7sZZqg');
