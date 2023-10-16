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


('East Green Lake Beach',47.68038121868206, -122.32959126508275,100,'ChIJ6zRuKRMUkFQRMZc47FZK47w'),
('Matthews Beach Park',47.696513820224354, -122.2737172777741,50,'ChIJn9QzzrgTkFQR_3_jS-a1i2Q'),
('Hamilton Viewpoint Park',47.5932966,-122.3860215,50,'ChIJS6xW9XRAkFQRJeXdrZSZ5tw'),
('Seattle Panoramic View',47.6293866,-122.3600709,50,'ChIJba5JKWoVkFQRbI5d85C-6l4'),
('Magnolia Viewpoint',47.6366221,-122.4070024,50,'ChIJl7yIjSs-kFQR4gtGlBDIwF8'),
('Gas Works - Lake View Point',47.6446589,-122.3344789,50,'ChIJe4eE6A4VkFQRi7QMR_E1awU'),
('The Gum Wall',47.6083607,-122.3403382,50,'ChIJaYxSWbJqkFQRIx56JsKqNCA'),
('Washington Park Arboretum',47.6364162,-122.2958146,50,'ChIJgTy59sYUkFQRin5kehZcTqI'),
('Madison Park Beach',47.63557651496766, -122.27671603069138,50,'ChIJmUviRrQUkFQRDUDtWv6c9gs');   