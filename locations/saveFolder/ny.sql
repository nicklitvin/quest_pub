
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


('The Channel Gardens',40.7585013,-73.97808700000002,50,'ChIJ5yWju_5YwokR6dgLgzNaIBw'),
('Cherry Hill',40.7747067,-73.9727283,50,'ChIJ8TaMS81ZwokRp8cqT1dag2A'),
('Stone street peatonal',40.7044752,-74.0102666,50,'ChIJ5QIbte9bwokRWYRp4rrpV0Y'),
('Panoramica de Manhattan',40.7044013,-73.99054989999999,50,'ChIJMZx9QwVbwokRGYD-5K3HXOk'),
('Times Square',40.7563736,-73.9864553,50,'ChIJmQJIxlVYwokRLgeuocVOGVU'),
('J Owen Grundy Park',40.71621529999999,-74.0318602,50,'ChIJ9bOGvKlQwokRcTO4Rb937Bk'),
('Statue of Liberty Vista Point',40.7009236,-74.0151612,50,'ChIJm9tkjRJawokR1LRAe3Sh-6w'),
('Castle Point Lookout',40.7443853,-74.0238383,50,'ChIJQ9YqJNxZwokRr_VHfBcHl-0'),
('Pier C Panoramic Viewpoint',40.7403707,-74.0250004,50,'ChIJ8dzx4hNZwokR22nsZAu2beE'),
('Riverwalk view of NYC',40.7807227,-74.0053583,50,'ChIJoWAQa4dZwokR18hQcVKrROo'),
('Observation Deck',40.7418655,-74.01133899999999,50,'ChIJZcoadLtZwokRI580-zWMld8'),
('Verrazzano View',40.61158492536289, -74.03708661965511,25,'ChIJJTVd7kZPwokRwLLk-za7Cd0');