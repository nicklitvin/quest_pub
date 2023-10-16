import db from "../modules/dbManager";
import { db_names } from "../globalConstants.js";
import interpreter from "../modules/clientInterpter";

describe("test event claim module", () => {
    const eventid_good = "1";
    const eventid_far = "2";
    const eventid_expired = "3";
    const event_id_later = "4";
    const lat = 0;
    const lng = 0;
    const good_offset = 0.001;
    const bad_offset = 1;
    const radius = 10000;
    const place_id = "123";
    const user_info = {email: "email"};

    const insert_event = async (
        title, radius, latitude, longitude, 
        place_id, start, end, link, event_id
    ) => {
        await db.run_sql(
            `
            insert into ${db_names.events_table}
            (
                ${db_names.locations_title_column},
                ${db_names.locations_latitude_column} ,
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

    const make_event = async (start_time,end_time,link,event_id,latitude=10,longitude=20) => {
        await insert_event(
            "title",radius,latitude,longitude,place_id,
            make_date(start_time), make_date(end_time),
            link,event_id
        );
    }

    beforeAll( async () => {
        db.make_database_connection();
        await db.make_empty_tables();
        
        await make_event(Date.now() - 1000,Date.now() + 1000000,
            null,eventid_good,lat + good_offset, lng + good_offset
        );
        await make_event(Date.now() - 1000,Date.now() + 1000000,
            null,eventid_far,lat + bad_offset, lng + bad_offset
        );
        await make_event(Date.now() - 100000,Date.now() - 50000,
            null,eventid_expired,lat + good_offset, lng + good_offset
        );
        await make_event(Date.now() + 10**8,Date.now() + 10**10,
            null,event_id_later,lat + good_offset, lng + good_offset
        );
    })

    afterEach(async () => {
        await db.run_sql(`delete from ${db_names.claims_table}`);
    })

    afterAll( async () => {
        await db.clear_all_tables();
        db.close_database_connection();
    })

    test("init events", async () => {
        expect(
            db.get_distance(lat,lng, lat + good_offset, lng + good_offset) < radius
        ).toEqual(true);

        expect(
            db.get_distance(lat,lng, lat + bad_offset, lng + bad_offset) < radius
        ).toEqual(false);
    })

    test("bad key + claim", async () => {
        const login = await interpreter.login_with_token("token",user_info);
        const result = await interpreter.claim_event("bad",eventid_good,lat,lng);
        
        expect(result.key).toEqual(null);
        expect(result.valid).toEqual(false);

        const data = await db.run_sql(`select * from ${db_names.claims_table}`);
        expect(data.length).toEqual(0);
    })

    test("good key + bad eventid" , async () => {
        const login = await interpreter.login_with_token("token",user_info);
        const result = await interpreter.claim_event(login.key,"bad id",lat,lng);
        
        expect(result.key).toEqual(login.key);
        expect(result.valid).toEqual(false);

        const data = await db.run_sql(`select * from ${db_names.claims_table}`);
        expect(data.length).toEqual(0);
    })

    test("good key + far event", async () => {
        const login = await interpreter.login_with_token("token",user_info);
        const result = await interpreter.claim_event(login.key,eventid_far,lat,lng);
        
        expect(result.key).toEqual(login.key);
        expect(result.valid).toEqual(false);

        const data = await db.run_sql(`select * from ${db_names.claims_table}`);
        expect(data.length).toEqual(0);
    })

    test("good key + expired", async () => {
        const login = await interpreter.login_with_token("token",user_info);
        const result = await interpreter.claim_event(login.key,eventid_expired,lat,lng);
        
        expect(result.key).toEqual(login.key);
        expect(result.valid).toEqual(false);

        const data = await db.run_sql(`select * from ${db_names.claims_table}`);
        expect(data.length).toEqual(0);
    })

    test("good key + not started", async () => {
        const login = await interpreter.login_with_token("token",user_info);
        const result = await interpreter.claim_event(login.key,event_id_later,lat,lng);
        
        expect(result.key).toEqual(login.key);
        expect(result.valid).toEqual(false);

        const data = await db.run_sql(`select * from ${db_names.claims_table}`);
        expect(data.length).toEqual(0);
    })

    test("good key + valid", async () => {
        const login = await interpreter.login_with_token("token",user_info);
        const result = await interpreter.claim_event(login.key,eventid_good,lat,lng);
        
        expect(result.key).toEqual(login.key);
        expect(result.valid).toEqual(true);

        const data = await db.run_sql(`select * from ${db_names.claims_table}`);
        expect(data.length).toEqual(1);

        const my_claim = data[0];
        expect(my_claim[db_names.claims_eventid_column]).toEqual(eventid_good);
        expect(my_claim[db_names.claims_placeid_column]).toEqual(place_id);
    })

    test("delete event claim", async () => {
        const login = await interpreter.login_with_token("token",user_info);
        await interpreter.claim_event(login.key,eventid_good,lat,lng);
        await interpreter.delete_account(login.key);

        const data = await db.run_sql(`select * from ${db_names.claims_table}`);
        expect(data.length).toEqual(0);
    })
})
