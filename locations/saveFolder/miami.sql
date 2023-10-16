
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


('South Pointe Park Lighthouse',25.766879,-80.1366695,50,'ChIJKcamPIm12YgRIodbjanBYqg'),
('Miami Skyline View',25.7467442,-80.1785257,100,'ChIJSRZQFJa12YgRtBOPHFX22Ko'),
('Point View',25.7587107,-80.1892142,50,'ChIJneKiRoC22YgRutTllrg6nvM'),
('Ocean Drive Miami Beach',25.7750277,-80.1318208,50,'ChIJOY2iBa212YgRlXpZZnyeSo8'),
('Museum Park Circuit',25.784023697881487, -80.1882313331483,50,'ChIJt4NDJGm32YgRDM7ohvusdGc'),
('David T. Kennedy Park',25.7348489,-80.2287444,50,'ChIJ7cSMoTW22YgRgR1BQSV5Q1Y'),
('Bayfront Park',25.7752589,-80.18618889999999,150,'ChIJd9nFxyC02YgRVdtnh8Obwp8'),
('Brickell City Centre',25.767171206973515, -80.19281653562233,150,'ChIJ9b849YC32YgR612tUl-KdyM');