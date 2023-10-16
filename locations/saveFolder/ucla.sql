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


('Kenneth Hahn View Point',34.0075333,-118.3597136,50,'ChIJ-xELZtm5woARy_A02cFb7Hk'),
('Inspiration Point',34.0596882,-118.5138398,50,'ChIJTZPtDWujwoARjYBRd5TTuBU'),
('The Point at the Bluffs',34.0360113,-118.5326475,50,'ChIJGfhHBICkwoARk0HIgW5ndPI'),
('Baldwin Hills Scenic Overlook',34.0182,-118.3819125,50,'ChIJX9JVNI65woARAltGGdhSBAA'),
('Election Walk',34.0713218,-118.443112,50,'ChIJm51n-oi8woARWs_sSmmNIHw'),
('Robert Irwin\'s Central Garden',34.0764775,-118.4742498,50,'ChIJpbxvgcW8woARoXNeJCWeUAU'),
('Beverly Cañon Gardens',34.0680886,-118.3992376,50,'ChIJb53h0fi7woARGgYdhxS24iY'),
('Santa Monica Beach',34.0126277814229, -118.5002676993787,50,'ChIJ8dXnU9ekwoAROOxLORAMcwE'),
('Centerpiece Park',34.0587131,-118.4140199,50,'ChIJrxO_1DO7woARrnHa-Km71D4'),
('Mulholland Scenic Overlook',34.1235149497038, -118.38752709705273,50,'ChIJAQAQ-nm-woARpvrBAefAhM8');