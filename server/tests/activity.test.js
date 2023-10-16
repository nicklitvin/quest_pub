import db from "../modules/dbManager";
import { db_names } from "../globalConstants.js";
import interpreter from "../modules/clientInterpter";

describe("test activity module", () => {
    const radius = 1000;
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

    const insert_location = async (title,lat,lng,radius,id) => {
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
            values ('${title}',${lat},${lng},${radius},'${id}')
            `
        );
    }

    const make_date = (time) => {
        let date_string = new Date(time).toUTCString();
        const date_sql = date_string.replace("GMT", '');
        return date_sql.slice(0,date_sql.length-1);
    }

    const make_event = async (start_time,end_time,link,event_id,latitude=10,longitude=20,place_id="12yh") => {
        await insert_event(
            "title",radius,latitude,longitude,place_id,
            make_date(start_time), make_date(end_time),
            link,event_id
        );
    }

    beforeAll( async () => {
        db.make_database_connection();
        await db.make_empty_tables();
    })

    afterEach(async () => {
    })

    afterAll( async () => {
        await db.clear_all_tables();
        db.close_database_connection();
    })

    test("both claimable", async () => {
        const lat = 1;
        const lng = 1;
        const place_id = "place_id";
        const event_id = "event_id";
        const link = "link";
        await make_event(Date.now(), Date.now() + 10000000, link, event_id,lat,lng,place_id);
        await insert_location("loc",lat,lng,radius,place_id);

        const login = await interpreter.login_with_token("token",user_info);
        const loc_res = await interpreter.claim_location(login.key,place_id,lat,lng);
        await new Promise(resolve => setTimeout( () => resolve(),2000));
        const eve_res = await interpreter.claim_event(login.key,event_id,lat,lng);

        expect(loc_res.valid).toEqual(true);
        expect(eve_res.valid).toEqual(true);

        const data = await db.run_sql(`select * from ${db_names.claims_table}`);
        expect(data.length).toEqual(2);

        const activity = await interpreter.get_user_activity(login.key,lat,lng);
        expect(activity.places.length).toEqual(2);

        const event_data = activity.places[0];
        const loc_data = activity.places[1];

        expect(loc_data.id).toEqual(place_id);
        expect(loc_data.distance).toEqual(0);
        expect(loc_data.date == null).toEqual(false);
        expect(loc_data.event_id == null).toEqual(true);

        expect(event_data.id).toEqual(place_id);
        expect(event_data.distance).toEqual(0);
        expect(event_data.web_link).toEqual(link);
        expect(event_data.date == null).toEqual(false);
        expect(event_data.event_id).toEqual(event_id);

    })
})