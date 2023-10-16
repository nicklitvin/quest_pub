
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


('Lou Neff Point',30.2672311,-97.7617013,50,'ChIJRexbRxa1RIYRbavL1-t0agI'),
('Covert Park at Mount Bonnell',30.3216722,-97.7732083,50,'ChIJecsZp8jKRIYR_WvZ0OYk9q0'),
('Sculpture Falls',30.26185019999999,-97.8235253,50,'ChIJ656QhmBKW4YRXNS33chcFhs'),
('Twin Falls',30.2488782,-97.8129865,50,'ChIJ5Ryk3x5LW4YROkR7l5C4drM'),
('Mount Bonnell',30.3216362,-97.7732334,50,'ChIJqz8Omk7LRIYR7RwG3Fn7QxE'),
('Zilker Holiday Tree',30.2662194,-97.7712406,50,'ChIJW5LdrTu1RIYRJdkNFvVcaPc'),
('Pennybacker Bridge Overlook',30.3511123,-97.79659389999999,50,'ChIJeZjGkNo0W4YR1VcHyhRTSC0'),
('Texas Capitol',30.2746652,-97.74035049999999,100,'ChIJz42sFKC1RIYROdCVpyJXb8s'),
('McKinney Falls State Park',30.1836487,-97.72219439999999,50,'ChIJi7M4Nb6zRIYRk8YBYI8Jg_s'),
('Octopus House',30.2541936,-97.75476300000001,50,'ChIJ-2Iv5LW1RIYRlsndP3gbzQE'),
('Mueller Lake Park',30.2967706,-97.70585229999999,50,'ChIJKYtScPm1RIYR3XNM9fOKrMY');