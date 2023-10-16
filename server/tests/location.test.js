import db from "../modules/dbManager";
import { db_names } from "../globalConstants.js";
import getDistance from "geolib/es/getPreciseDistance";
import interpreter from "../modules/clientInterpter";

describe("test locations module", () => {
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

    const make_event = async (title,place_id,start_time,end_time,link,event_id,latitude=10,longitude=20) => {
        await insert_event(
            title,10,latitude,longitude,place_id,
            make_date(start_time), make_date(end_time),
            link,event_id
        );
    }

    const make_location = (latitiude, longitude, title=null, radius=null, id=null) => {
        return {
            title: title,
            radius: radius,
            latitiude: latitiude,
            longitude: longitude,
            id: id
        }
    };

    const loc_radius = 100;
    const my_loc = make_location(37.4,-122.4);
    const place_id1 = "id1";
    const eventid1 = "eventid1";
    const loc1 = make_location(37.5,-122.4,"1",loc_radius,place_id1);
    const loc2 = make_location(38,-100,"2",loc_radius,"id2");
    const loc3 = make_location(0,0,"3",loc_radius,"id3");
    const loc4 = make_location(-38,12,"4",loc_radius,"id4");
    const loc5 = make_location(38,-122,"5",99000,"id5");

    beforeAll( async () => {
        db.make_database_connection();
        await db.make_empty_tables();
        await make_event("title",place_id1,Date.now() - 10**8, Date.now() + 10**8,
            null,eventid1,loc1.latitiude, loc1.longitude
        )

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
            ('${loc1.title}', ${loc1.latitiude},${loc1.longitude},${loc1.radius},'${loc1.id}'),
            ('${loc2.title}', ${loc2.latitiude},${loc2.longitude},${loc2.radius},'${loc2.id}'),      
            ('${loc3.title}', ${loc3.latitiude},${loc3.longitude},${loc3.radius},'${loc3.id}'),      
            ('${loc4.title}', ${loc4.latitiude},${loc4.longitude},${loc4.radius},'${loc4.id}'),
            ('${loc5.title}', ${loc5.latitiude},${loc5.longitude},${loc5.radius},'${loc5.id}')            
            `
        )
    })

    afterAll( async () => {
        await db.clear_all_tables();
        db.close_database_connection();
    })

    test("locations init", async () => {
        const alias = "col";
        const result = await db.run_sql(
            `
            select count(*) as ${alias}
            from ${db_names.locations_table}
            `
        );
        expect(result[0][alias]).toEqual(5);

        const event = await db.run_sql(
            `
            select count(*) as ${alias}
            from ${db_names.events_table}
            `
        )
        expect(event[0][alias]).toEqual(1);
    })

    test("compare sql to my distance", async () => {
        const my_lat = 10;
        const my_lng = 20;

        const data = await db.get_locations(null,my_lat,my_lng);

        const returned_dist = Number(data[0].distance);
        const calc_dist = db.get_distance(
            my_lat,my_lng,Number(data[0].latitude),Number(data[0].longitude),Number(data[0].radius)
        ) 

        expect(calc_dist).toEqual(returned_dist);
    })

    test("valid locations", async () => {
        expect(db.is_coordinate_valid(2,[2,5])).toEqual(false);
        expect(db.is_coordinate_valid([3,4],null)).toEqual(false);
        expect(db.is_coordinate_valid(2,"2")).toEqual(false);
        expect(db.is_coordinate_valid(null)).toEqual(false);
        expect(db.is_coordinate_valid(-91,0)).toEqual(false);
        expect(db.is_coordinate_valid(91,0)).toEqual(false);
        expect(db.is_coordinate_valid(0,-1238)).toEqual(false);
        expect(db.is_coordinate_valid(0,181)).toEqual(false);
        expect(db.is_coordinate_valid(0,{23:3})).toEqual(false);
        expect(db.is_coordinate_valid(my_loc.latitiude,my_loc.longitude)).toEqual(true);
    })

    test("get locations + bad coordinates", async () => {
        const result = await interpreter.get_locations(null,-91,0);
        expect(result.places.length).toEqual(0);
    })

    test("get locations + valid coordinates", async () => {
        const result = await interpreter.get_locations(null,my_loc.latitiude,my_loc.longitude);
        const quests = result.places;
        
        expect(quests[0].title).toEqual(loc5.title);
        expect(quests[1].title).toEqual(loc1.title);
        expect(quests[2].title).toEqual(loc2.title);
        expect(quests[3].title).toEqual(loc3.title);
        expect(quests[4].title).toEqual(loc4.title);

        expect(quests[1].id).toEqual(loc1.id);

        expect(Number(quests[0].distance)).toEqual(0);
        expect(Number(quests[1].radius)).toEqual(loc_radius);

        // diff between geolib and my formula
        const diff_const = 0.01

        const start1 = {latitude: my_loc.latitiude, longitude: my_loc.longitude};
        const end1 = {latitude: loc1.latitiude, longitude: loc1.longitude};
        const my_distance1 = Number(quests[1].distance) + Number(quests[1].radius);
        const geolib_distance1 = getDistance(start1,end1);
        const mydistance_vs_geloib1 = Math.abs(geolib_distance1 - my_distance1);
        expect(mydistance_vs_geloib1 < geolib_distance1 * diff_const).toEqual(true);

        const start4 = {latitude: my_loc.latitiude, longitude: my_loc.longitude};
        const end4 = {latitude: loc4.latitiude, longitude: loc4.longitude};
        const my_distance4 = Number(quests[4].distance) + Number(quests[4].radius);
        const geolib_distance4 = getDistance(start4,end4);
        const mydistance_vs_geloib4 = Math.abs(geolib_distance4 - my_distance4);
        expect(mydistance_vs_geloib4 < geolib_distance4 * diff_const).toEqual(true);
    })

    test("get locations ordered", async () => {
        const result = await db.get_locations(null,my_loc.latitiude, my_loc.longitude);
        expect(result[0].distance < result[1].distance).toEqual(true);
        expect(result[1].distance < result[2].distance).toEqual(true);
        expect(result[2].distance < result[3].distance).toEqual(true);
    })

    test("get locations + duplicate name exists", async () => {
        const unique_id = "unique_id";
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
            ('${loc1.title}', ${loc4.latitiude - 1}, ${loc4.longitude + 1},${loc1.radius},'${unique_id}')
            `
        );

        const result = await db.get_locations(null,loc1.latitiude,loc1.longitude);
        expect(result[0].id).toEqual(loc1.id);
        expect(result[result.length-1].id).toEqual(unique_id);

        await db.run_sql(
            `
            delete from ${db_names.locations_table}
            where ${db_names.locations_placeid_column} = '${unique_id}'
            `
        )
    })

    test("get locations + claimed event with same placeid", async () => {
        const login = await interpreter.login_with_token("1",{email: "email"});
        const eve_claim = await interpreter.claim_event(login.key,eventid1,loc1.latitiude,loc1.longitude);
        expect(eve_claim.valid).toEqual(true);

        const locations = await interpreter.get_locations(login.key,loc1.latitiude,loc1.longitude);
        expect(locations.places.length).toEqual(5);
    })
})