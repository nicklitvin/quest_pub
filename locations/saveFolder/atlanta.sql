
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

('Morgan Falls Overlook Park',33.9704275,-84.3795138,50,'ChIJ8S5fllwM9YgRWhGzNogvafg'),
('Heritage Park',33.8389871,-84.5427608,50,'ChIJdw1n5ukZ9YgRwMrrAAQZ4Gs'),
('Centennial Olympic Park',33.760463,-84.3930831,50,'ChIJIRYhpn8E9YgRWy0NPvzLU1M'),
('Krog Street Tunnel',33.7529948,-84.36364789999999,50,'ChIJNRK26_kD9YgRQXqMhEXh_QQ'),