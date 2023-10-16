import db from "../modules/dbManager";
import { db_names } from "../globalConstants.js";
import interpreter from "../modules/clientInterpter";

describe("test events module", () => {
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
            "title",10,latitude,longitude,"123",
            make_date(start_time), make_date(end_time),
            link,event_id
        );
    }

    beforeAll( async () => {
        db.make_database_connection();
        await db.make_empty_tables();
    })

    afterEach(async () => {
        await db.run_sql(`delete from ${db_names.events_table}`);
    })

    afterAll( async () => {
        await db.clear_all_tables();
        db.close_database_connection();
    })

    test("get events + bad coordinates", async () => {
        const result = await interpreter.get_events(null,-91,0);
        expect(result.places.length).toEqual(0);
    })

    test("get events + valid coordinates", async () => {
        const event_id = "234";
        await make_event(Date.now(), Date.now() + 10000, null, event_id);

        const user_info = {email:"email"};
        const login = await interpreter.login_with_token("token",user_info);
        const result = await interpreter.get_events(login.key,0,0);

        expect(result.places.length).toEqual(1);

        const place = result.places[0];
        expect(place.title == null).toEqual(false);
        expect(place.latitude == null).toEqual(false);
        expect(place.longitude == null).toEqual(false);
        expect(place.distance == null).toEqual(false);
        expect(place.radius == null).toEqual(false);
        expect(place.id == null).toEqual(false);
        expect(place.event_id).toEqual(event_id);
        expect(place.start_time == null).toEqual(false);
        expect(place.end_time == null).toEqual(false);
        expect(place.is_happening).toEqual(true);
    })

    test("get events + event passed", async () => {
        const event_id = "234";
        await make_event(Date.now() - 100000,Date.now() - 50000,null,event_id);

        const user_info = {email:"email"};
        const login = await interpreter.login_with_token("token",user_info);
        const result = await interpreter.get_events(login.key,0,0);

        expect(result.places.length).toEqual(0);
    })

    test("get events ordered", async () => {
        const event_id_close = "234";
        const event_id_far = "345";
        const lat = 0;
        const lng = 0;

        await make_event(Date.now() - 1000,Date.now() + 100000,
            null,event_id_close,lat + 0.1, lng + 0.1
        );
        await make_event(Date.now() - 1000,Date.now() + 100000,
            null,event_id_far,lat + 1, lng + 1
        );

        const user_info = {email:"email"};
        const login = await interpreter.login_with_token("token",user_info);
        const result = await interpreter.get_events(login.key,lat,lng);

        expect(result.places[0].event_id).toEqual(event_id_close);
        expect(result.places[1].event_id).toEqual(event_id_far);
    })

    test("future event is unclaimable", async () => {
        const event_id = "id1";
        const lat = 0;
        const lng = 0;
        await make_event(Date.now() + 10**8,Date.now() + 10**10,
            null,event_id,lat, lng
        );
        const user_info = {email:"email"};
        const login = await interpreter.login_with_token("token",user_info);
        const result = await interpreter.get_events(login.key,lat,lng);
        expect(result.places[0].is_happening).toEqual(false);
    })
})