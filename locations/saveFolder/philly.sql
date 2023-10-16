
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


('Spruce Street Harbor Park',39.9443944,-75.14148329999999,50,'ChIJv2tKaJDIxokRNjXcij0s6U4'),
('Race Street Pier',39.9531479,-75.1388015,50,'ChIJWUUUDInIxokRiSVlw-fAI54'),
('Logan Square',39.9580333,-75.1709604,100,'ChIJayuuCzTGxokRak65s-xv_Oo'),
('Franklin Square',39.9556634,-75.1504502,100,'ChIJ1U-L54DIxokRcoW6JtzjcDM'),
('Dilworth Park',39.9530357,-75.16468429999999,50,'ChIJh7CgRy7GxokRJ1eaM21VO48'),
('Fairmount Park',39.9881142,-75.1971204,500,'ChIJUyEPZwO5xokRfaREsFG789k'),
('Schuylkill Banks',39.952188403135494, -75.18066661405803,100,'ChIJ1QhLoknGxokRY1BxIaMBmEY');

    