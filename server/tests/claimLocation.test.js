import db from "../modules/dbManager";
import interpreter from "../modules/clientInterpter";
import { db_names, other_consts } from "../globalConstants.js";

describe("test location claim module", () => {
    const make_location = (latitiude, longitude, title=null, radius=null, id=null) => {
        return {
            title: title,
            radius: radius,
            latitude: latitiude,
            longitude: longitude,
            id: id
        }
    };

    const get_total_claims = async () => {
        const data = await db.run_sql(
            `
            select * from ${db_names.claims_table}
            `
        )
        return data.length;
    }

    const user_info = {email: "my_email"};
    const user1_info = {email: "my_email_1"};

    const loc1_title = "loc1_title";
    const claim_radius = 1670;
    const loc1 = make_location(37.4,-122.4,loc1_title,claim_radius,"loc1_id");
    const claim_loc1 = make_location(37.4,-122.41);
    const bad_claim_loc1 = make_location(37.4,-122.43);

    const loc2 = make_location(0,0,"location_2",claim_radius,"loc2_id");
    const loc3 = make_location(0,0,loc1_title,claim_radius,"loc3_id");

    const locs = [loc1,loc2,loc3];

    const event_setup = async (my_event_id) => {
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
                "title",loc1.radius,loc1.latitude,loc1.longitude,loc1.id,
                make_date(start_time), make_date(end_time),
                link,event_id
            );
        }

        await make_event(Date.now() - 1000,Date.now() + 1000000,
            null,my_event_id,loc1.latitude, loc1.longitude
        );
    }

    beforeAll(async () => {
        db.make_database_connection();
        await db.make_empty_tables();

        for (let loc of locs) {
            await db.run_sql(
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
                ('${loc.title}', ${loc.latitude}, ${loc.longitude}, '${loc.radius}', '${loc.id}')
                `
            )
        }
    })

    afterAll( async () => {
        await db.clear_all_tables();
        db.close_database_connection();
    })

    afterEach( async () => {
        await db.run_sql(
            `
            delete from ${db_names.claims_table};
            `
        );
    })

    test("init variables", async () => {
        const user_loc = {
            latitude: loc1.latitude, 
            longitude: loc1.longitude
        };
        const good_loc = {
            latitude: claim_loc1.latitude,
            longitude: claim_loc1.longitude
        };
        const bad_loc = {
            latitude: bad_claim_loc1.latitude,
            longitude: bad_claim_loc1.longitude
        };

        const good_dist = db.get_distance(
            user_loc.latitude, user_loc.longitude,
            good_loc.latitude, good_loc.longitude, loc1.radius
        );
        expect(good_dist).toEqual(0);

        const bad_dist = db.get_distance(
            user_loc.latitude, user_loc.longitude,
            bad_loc.latitude, bad_loc.longitude, loc1.radius
        )
        expect(bad_dist > 0).toEqual(true);
    })

    test("bad key + claim", async () => {
        const result = await interpreter.claim_location(
            "badKey", loc1.id, claim_loc1.latitude, claim_loc1.longitude
        );
        expect(result.key == null).toEqual(true);
        expect(await get_total_claims()).toEqual(0);
    })

    test("good key + bad claim", async () => {
        const key = (await interpreter.login_with_token("token",user_info)).key
        const result = await interpreter.claim_location(
            key, loc1.id, bad_claim_loc1.latitude, bad_claim_loc1.longitude
        );
        expect(result.valid).toEqual(false);
        expect(await get_total_claims()).toEqual(0);
    })

    test("good key + good claim", async () => {
        const key = (await interpreter.login_with_token("token",user_info)).key
        const result = await interpreter.claim_location(
            key, loc1.id, claim_loc1.latitude, claim_loc1.longitude
        );
        expect(result.valid).toEqual(true);
        expect(await get_total_claims()).toEqual(1);
    })

    test("good key + bad title", async () => {
        const key = (await interpreter.login_with_token("token",user_info)).key
        const result = await interpreter.claim_location(
            key, "bad_id", claim_loc1.latitude, claim_loc1.longitude
        );
        expect(result.valid).toEqual(false);
        expect(await get_total_claims()).toEqual(0);
    })

    test("good key + repeated claim", async () => {
        const key = (await interpreter.login_with_token("token",user_info)).key
        await interpreter.claim_location(
            key, loc1.id, claim_loc1.latitude, claim_loc1.longitude
        );
        expect(await get_total_claims()).toEqual(1);

        const result = await interpreter.claim_location(
            key, loc1.id, claim_loc1.latitude, claim_loc1.longitude,
        );
        expect(result.valid).toEqual(false);
        expect(await get_total_claims()).toEqual(1);
    })

    test("claim location after event with same id", async () => {
        const event_id = "1";
        await event_setup(event_id);

        let locations = await db.run_sql(
            `
            select * from ${db_names.locations_table}
            where ${db_names.locations_placeid_column} = '${loc1.id}'
            `
        )
        expect(locations.length).toEqual(1);

        let events = await db.run_sql(
            `
            select * from ${db_names.events_table}
            where ${db_names.locations_placeid_column} = '${loc1.id}'
            `
        );
        expect(events.length).toEqual(1);
        
        const login = await interpreter.login_with_token("token1",user1_info);
        const event_claim = await interpreter.claim_event(
            login.key, event_id, claim_loc1.latitude, claim_loc1.longitude
        ) 
        expect(event_claim.valid).toEqual(true);

        const loc_claim = await interpreter.claim_location(
            login.key, loc1.id, claim_loc1.latitude, claim_loc1.longitude
        )

        expect(loc_claim.valid).toEqual(true);

        const data = await db.run_sql(`select * from ${db_names.claims_table}`)
        expect(data.length).toEqual(2);
    })

    test("delete claims", async () => {
        const data = await interpreter.login_with_token("token",user_info);
        await interpreter.claim_location(
            data.key, loc1.id, claim_loc1.latitude, claim_loc1.longitude
        )

        const other_data = await interpreter.login_with_token("token1",user1_info);
        await interpreter.claim_location(
            other_data.key, loc1.id, claim_loc1.latitude, claim_loc1.longitude
        )

        const claims_before = await db.run_sql(
            `
            select * from ${db_names.claims_table}
            `
        );
        expect(claims_before.length).toEqual(2);

        const result = await interpreter.delete_account(data.key);
        expect(result.valid).toEqual(true);

        const claims_after = await db.run_sql(
            `
            select * from ${db_names.claims_table}
            `
        );
        expect(claims_after.length).toEqual(1);
    })
})