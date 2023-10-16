import DbManager from "./modules/dbManager.js";
import { db_names } from "./globalConstants.js";

const username_1 = "user1";
const username_2 = "user2";
const username_3 = "user3";

const email_1 = DbManager.make_email_encrypted("email1");
const email_2 = DbManager.make_email_encrypted("email2");
const email_3 = DbManager.make_email_encrypted("email3");

const me = DbManager.make_email_encrypted("quest.throwaway.acc@gmail.com");
const place_id = "ChIJi6C1MxquEmsR9-c-3O48ykI";

const add_user = async (username,email) => {
    await DbManager.run_sql(
        `
        insert into ${db_names.users_table}
        (
            ${db_names.users_email_column}, 
            ${db_names.users_username_column},
            ${db_names.users_change_date_column},
            ${db_names.users_create_date_column}
        )
        values 
        ('${email}','${username}','${db_names.unix_time_start}',utc_timestamp())
        `
    );
}

const clear_tables = async () => {
    await DbManager.make_empty_tables();
}

const title1 = "1";
const lat1 = 20.005;
const long1 = 30.005;
const radius1 = 700;

const title2 = "2"
const radius2 = 90000;

const lat3 = 37;
const long3 = -100;

const title3 = "3";
const radius3 = 10;

const title4 = "4";
const radius4 = 10000;

const add_locations = async () => {
    await DbManager.run_sql (
        `
        insert into ${db_names.locations_table}
        (
            ${db_names.locations_title_column}, 
            ${db_names.locations_latitude_column},
            ${db_names.locations_longitude_column},
            ${db_names.locations_radius_column},
            ${db_names.locations_placeid_column}
        )
        values
        ('${title1}', ${lat1}, ${long1}, ${radius1}, '${place_id}'),
        ('${title2}', ${lat1}, ${long1}, ${radius2}, '${"id2"}'),
        ('${title3}', ${lat3}, ${long3}, ${radius3}, '${"id3"}'),
        ('${title4}', ${lat3}, ${long3}, ${radius4}, '${"id4"}')
        `
    )
}

const insert_event = async (
    title, radius, latitude, longitude, 
    place_id, start, end, link, event_id
) => {
    await DbManager.run_sql(
        `
        insert into ${db_names.events_table}
        (
            ${db_names.locations_title_column},
            ${db_names.locations_latitude_column},
            ${db_names.locations_longitude_column},
            ${db_names.locations_radius_column},
            ${db_names.locations_placeid_column},
            
            ${db_names.events_start_time_column},
            ${db_names.events_end_time_column},
            ${db_names.events_link_column},
            ${db_names.events_id_column}
        )

        values (
            '${title}', ${latitude}, ${longitude}, ${radius}, '${place_id}', 
            str_to_date('${start}', '%a, %d %b %Y %H:%i:%s'), 
            str_to_date('${end}', '%a, %d %b %Y %H:%i:%s'), 
            '${link}', '${event_id}'
        )
        `
    )
};

const make_date = (time) => {
    let date_string = new Date(time).toUTCString();
    const date_sql = date_string.replace("GMT", '');
    return date_sql.slice(0,date_sql.length-1);
}

const make_event = async (title,radius,start_time,end_time,link,event_id,latitude=10,longitude=20,use_link=true) => {
    await insert_event(
        title,radius,latitude,longitude,place_id,
        make_date(start_time), make_date(end_time),
        use_link ? link : null,event_id
    );
}

const long_ago = Date.now() - 10**6;
const future = Date.now() + 10**10;
const far_future = Date.now() + 10**11;
const link = "https://nicklitvin.github.io/quest_supp/";

const add_events = async () => {
    await make_event("ti1",10,long_ago,future,link,"eid1",lat1,long1,false);
    await make_event("ti2",10000,long_ago,future,link,"eid2",lat1,long1);
    await make_event("ti3",90000,long_ago,future,link,"eid3",lat3,long3);
    await make_event("ti4",10000,future,far_future,link,"eid4",lat1,long1,false);
}

const add_claims = async (email) => {
    await DbManager.insert_claim(email,place_id);
    await DbManager.insert_claim(email,place_id);
    await DbManager.insert_claim(email,place_id);
}

DbManager.make_database_connection_live();

add_events();
add_locations();
// add_user(username_1, email_1);
// add_user(username_2, email_2);
// add_user(username_3, email_3);

// add_claims(me);
