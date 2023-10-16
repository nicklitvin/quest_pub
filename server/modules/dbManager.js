import { db_init, db_names, data_types, other_consts, use_aws_ip } from "../globalConstants.js";
import dotenv from 'dotenv';
import mysql from "mysql2";
import { createHash } from "crypto";

/**
 * The DbManager contains functions to interact with the database based on what
 * is requested by ClientManager. Before calling any functions, a pool to the database
 * must be created with make_database_connection(). The pool must be then closed
 * after usage with close_database_connection().
 */
export default class DbManager {
    static pool;

    // setup

    static make_database_connection_live() {
        dotenv.config();

        DbManager.pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            timezone: "UTC"
        }).promise();
    }

    // use for testing to not clutter terminal with timezone warning
    static make_database_connection() {
        dotenv.config();

        DbManager.pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        }).promise();
    }

    static close_database_connection() {
        if (DbManager.pool) {
            DbManager.pool.end();
        }
    }

    static async make_empty_tables() {
        await DbManager.run_sql(db_init);
    }

    static async run_sql(commands) {
        let curr_command = "";
        let for_type_purpose = [];
        let result = [...for_type_purpose];
        
        try{
            commands = commands.split(";");
            commands = commands.map( (command) => command.trim());
            for (let command of commands) {
                if (!command) continue;

                curr_command = command;
                let operation = command.split(" ")[0];
                let output = await DbManager.pool.query(command);

                if (operation == "select") {
                    result = output[0];
                }
            }
        } catch (err) {
            if (!use_aws_ip) console.log("bad sql command: ", curr_command)
        }
        return result;
    }

    static async clear_all_tables() {
        await DbManager.run_sql(
            `
            delete from ${db_names.users_table};
            delete from ${db_names.claims_table};
            delete from ${db_names.locations_table};
            delete from ${db_names.events_table};
            `
        );
    }

    // GET FUNCTIONS

    static get_distance(from_lat, from_lng, to_lat, to_lng, radius=0) {
        return (
            Math.max(
                0,
                6371 * 1000 * Math.acos(
                    Math.cos(from_lat * Math.PI/180) * Math.cos(to_lat * Math.PI/180) * 
                    Math.cos(to_lng * Math.PI/180 - from_lng * Math.PI/180) + 
                    Math.sin(from_lat * Math.PI/180) * Math.sin(to_lat * Math.PI/180)     
                ) - radius
            )
        )
    }

    static async get_event(event_id) {
        const data = await DbManager.run_sql(
            `
            select * from ${db_names.events_table}
            where ${db_names.events_id_column} = '${event_id}'
            `
        );

        return data.length > 0 ? data[0] : null;
    }

    static async get_location(place_id) {
        const data = await DbManager.run_sql(
            `
            select * from ${db_names.locations_table}
            where ${db_names.locations_placeid_column} = '${place_id}'
            `
        )
        return data.length > 0 ? data[0] : null;
    }

    static async get_user_activity(email,latitude,longitude) {
        const result = [];
        const claim_data = await DbManager.run_sql(
            `
            select * from ${db_names.claims_table}
            where ${db_names.claims_email_column} = '${email}'
            order by ${db_names.claims_date_column} desc
            `
        );

        for (let claim of claim_data) {
            const is_event = claim[db_names.claims_eventid_column] != null;
            const row = {...data_types.activity};

            row.date = claim[db_names.claims_date_column];
            
            if (is_event) {
                const event_id = claim[db_names.events_id_column];
                const event_data = await DbManager.get_event(event_id);
                
                const event_lat = event_data[db_names.locations_latitude_column];
                const event_lng = event_data[db_names.locations_longitude_column];
                const radius = event_data[db_names.locations_radius_column];
                const distance = DbManager.get_distance(
                    latitude, longitude, event_lat, event_lng, radius
                );

                row.distance = distance;
                row.title = event_data[db_names.locations_title_column];
                row.web_link = event_data[db_names.events_link_column];
                row.id = event_data[db_names.locations_placeid_column];
                row.event_id = event_data[db_names.events_id_column];
            } else {
                const place_id = claim[db_names.locations_placeid_column];
                const place_data = await DbManager.get_location(place_id);

                const place_lat = place_data[db_names.locations_latitude_column];
                const place_lng = place_data[db_names.locations_longitude_column];
                const radius = place_data[db_names.locations_radius_column];
                const distance = DbManager.get_distance(
                    latitude, longitude, place_lat, place_lng, radius
                );

                row.distance = distance;
                row.title = place_data[db_names.locations_title_column];
                row.id = place_data[place_id];
            }

            result.push(row);
        }
        return result;
    }

    static async get_locations(email,latitude,longitude) {
        const result = [];

        if (DbManager.is_coordinate_valid(Number(latitude),Number(longitude))) {
            const data = await DbManager.run_sql(
                `
                select 
                    *,
                    greatest(0,
                        6371 * 1000 *acos(
                            cos(radians(${latitude})) * cos(radians(latitude)) * 
                            cos(radians(longitude) - radians(${longitude})) + 
                            sin(radians(${latitude})) * sin(radians(latitude))     
                        ) - ${db_names.locations_radius_column}
                    ) as ${db_names.locations_distance_alias}
                from ${db_names.locations_table}
                where ${db_names.locations_placeid_column} not in  
                (
                    select ${db_names.claims_placeid_column} 
                    from ${db_names.claims_table}
                    where ${db_names.claims_email_column} = '${email}'
                    and ${db_names.claims_eventid_column} is null
                )
                order by ${db_names.locations_distance_alias} asc
                limit ${other_consts.location_num_responses}
                `
            );
            for (let row of data) {
                let to_add = {...data_types.activity};
                to_add.title = row[db_names.locations_title_column];
                to_add.distance = row[db_names.locations_distance_alias];
                to_add.latitude = row[db_names.locations_latitude_column];
                to_add.longitude = row[db_names.locations_longitude_column];
                to_add.radius = row[db_names.locations_radius_column];
                to_add.id = row[db_names.locations_placeid_column];
                result.push(to_add);
            }
        }
        return result;
    }

    static async get_events(email,latitude,longitude) {
        let result = [];

        if (DbManager.is_coordinate_valid(Number(latitude),Number(longitude))) {
            const is_claimable_alias = "is_claimable";

            const data = await DbManager.run_sql(
                `
                select 
                    *,
                    greatest(0,
                        6371 * 1000 *acos(
                            cos(radians(${latitude})) * cos(radians(latitude)) * 
                            cos(radians(longitude) - radians(${longitude})) + 
                            sin(radians(${latitude})) * sin(radians(latitude))     
                        ) - ${db_names.locations_radius_column}
                    ) as ${db_names.locations_distance_alias},
                    case
                        when ${db_names.events_start_time_column} > (select utc_timestamp()) then false
                        else true
                    end as ${is_claimable_alias}
                from ${db_names.events_table}
                where ${db_names.events_id_column} not in  
                (
                    select ${db_names.claims_eventid_column} 
                    from ${db_names.claims_table}
                    where ${db_names.claims_email_column} = '${email}'
                    and ${db_names.claims_eventid_column} is not null
                ) and ${db_names.events_end_time_column} > (select utc_timestamp())
                order by ${db_names.locations_distance_alias} asc
                limit ${other_consts.location_num_responses}
                `
            );
            for (let row of data) {
                let to_add = {...data_types.activity};
                to_add.title = row[db_names.locations_title_column];
                to_add.distance = row[db_names.locations_distance_alias];
                to_add.latitude = row[db_names.locations_latitude_column];
                to_add.longitude = row[db_names.locations_longitude_column];
                to_add.radius = row[db_names.locations_radius_column];
                to_add.id = row[db_names.locations_placeid_column];

                to_add.start_time = row[db_names.events_start_time_column];
                to_add.end_time = row[db_names.events_end_time_column];
                to_add.web_link = row[db_names.events_link_column];
                to_add.event_id = row[db_names.events_id_column];
                to_add.is_happening = row[is_claimable_alias] == 1;
                result.push(to_add);
            }
        }

        return result;
    }

    static async get_key_from_email(email) {
        let data = await DbManager.run_sql(
            `
            select ${db_names.users_key_column} from ${db_names.users_table}
            where ${db_names.users_email_column} = '${email}'
            `
        );
        return data.length > 0 ? data[0][db_names.users_key_column] : null;
    }

    static async get_email_from_key(key) {
        let data = await DbManager.run_sql(
            `
            select * from ${db_names.users_table}
            where ${db_names.users_key_column} = '${key}'
            `
        );
        return data.length > 0 ? data[0][db_names.users_email_column] : null;
    }

    static async get_placeid_from_eventid(event_id) {
        const data = await DbManager.run_sql(
            `
            select * from ${db_names.events_table}
            where ${db_names.events_id_column} = '${event_id}'
            `
        );
        return data.length > 0 ? data[0][db_names.locations_placeid_column] : null;
    }

    // IS FUNCTIONS

    static is_coordinate_valid(latitude,longitude) {
        if (typeof(latitude) != 'number' || typeof(longitude) != 'number') return false;
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return false;
        return true;
    }

    static async is_email_taken(email, encrypted) {
        if (!encrypted) email = DbManager.make_encrypted(email);

        let data = await DbManager.run_sql(
            `
            select * from ${db_names.users_table}
            where ${db_names.users_email_column} = '${email}'
            `
        );
        return data.length > 0;
    }

    static async is_location_claim_valid(email,latitude,longitude,place_id) {
        if (!(DbManager.is_coordinate_valid(latitude,longitude))) return false;

        let previous_claim_data = await DbManager.run_sql(
            `
            select * from ${db_names.claims_table}
            where ${db_names.claims_email_column} = '${email}' and 
                ${db_names.claims_placeid_column} = '${place_id}' and
                ${db_names.claims_eventid_column} is null
            `   
        );
        if (previous_claim_data.length > 0) return false;
        
        let data = await DbManager.run_sql(
            `
            select ${db_names.locations_latitude_column}, ${db_names.locations_longitude_column}, 
                ${db_names.locations_radius_column}
            from ${db_names.locations_table}
            where ${db_names.locations_placeid_column} = '${place_id}'
            `
        );

        if (data.length == 0) return false;

        const distance = DbManager.get_distance(
            latitude, longitude, 
            Number(data[0][db_names.locations_latitude_column]),
            Number(data[0][db_names.locations_longitude_column])
        );

        const max_distance = Number(data[0][db_names.locations_radius_column]);
        if (distance < max_distance) {
            return true;
        } else {
            return false;
        }
    }

    static async is_event_claim_valid(email, latitude, longitude, event_id) {
        if (!(DbManager.is_coordinate_valid(latitude,longitude))) return false;

        let previous_claim_data = await DbManager.run_sql(
            `
            select * from ${db_names.claims_table}
            where ${db_names.claims_email_column} = '${email}' and 
                ${db_names.claims_eventid_column} = '${event_id}'
            `   
        );
        if (previous_claim_data.length > 0) return false;
        
        let data = await DbManager.run_sql(
            `
            select ${db_names.locations_latitude_column}, ${db_names.locations_longitude_column}, 
                ${db_names.locations_radius_column}
            from ${db_names.events_table}
            where ${db_names.events_id_column} = '${event_id}'
            `
        );

        if (data.length == 0) return false;

        const distance = DbManager.get_distance(
            latitude, longitude, 
            Number(data[0][db_names.locations_latitude_column]),
            Number(data[0][db_names.locations_longitude_column])
        );

        const max_distance = Number(data[0][db_names.locations_radius_column]);
        if (distance < max_distance) {
            return true;
        } else {
            return false;
        }
    }

    static async is_event_happening(event_id) {
        const data = await DbManager.run_sql(
            `
            select * from ${db_names.events_table}
            where ${db_names.events_id_column} = '${event_id}'
                and ${db_names.events_end_time_column} > (select utc_timestamp())
                and ${db_names.events_start_time_column} < (select utc_timestamp())
            `
        )
        return data.length > 0 ? true : false;
    }

    // MAKE FUNCTIONS

    static make_encrypted(content) {
        const hash = createHash("sha256");
        hash.update(content);
        const result = hash.digest("hex");
        return result
    }

    static async make_key(content) {
        let num = 0;
        let result;

        while (true) {
            const hash = createHash("sha256");
            hash.update(`${content}${num}`);
            result = hash.digest("hex");

            let does_exist = await DbManager.run_sql(
                `
                select * from ${db_names.users_table}
                where ${db_names.users_key_column} = '${result}'
                `
            );
            if (does_exist.length > 0) {
                num += 1;
            } else {
                return result;
            }
        }
    }

    static make_email_encrypted(email) {
        const hash = createHash("sha256");
        hash.update(email);
        const result = hash.digest("hex");
        return result
    }

    static async make_user(email,token) {
        let account_key = DbManager.make_encrypted(token);
        let encrypted_email = DbManager.make_encrypted(email);

        await DbManager.run_sql(
            `
            insert into ${db_names.users_table}
            (   
                ${db_names.users_key_column},
                ${db_names.users_email_column}
            )
            values ('${account_key}', '${encrypted_email}');
            `
        );
        return account_key;
    }

    // DELETE FUNCTIONS

    static async delete_user(email) {
        await DbManager.delete_user_info(email);
        await DbManager.delete_user_claims(email);
    }

    static async delete_user_info(email) {
        await DbManager.run_sql(
            `
            delete from ${db_names.users_table}
            where ${db_names.users_email_column} = '${email}'
            `
        )
    }

    static async delete_user_claims(email) {
        await DbManager.run_sql(
            `
            delete from ${db_names.claims_table}
            where ${db_names.claims_email_column} = '${email}'
            `
        )
    }

    static async insert_location_claim(email, place_id) {
        await DbManager.run_sql(
            `
            insert into ${db_names.claims_table}
            (
                ${db_names.claims_email_column}, 
                ${db_names.claims_placeid_column},
                ${db_names.claims_date_column}
            )
            values ('${email}','${place_id}',utc_timestamp())
            `
        )
    }

    static async insert_event_claim(email, place_id, event_id) {
        await DbManager.run_sql(
            `
            insert into ${db_names.claims_table}
            (
                ${db_names.claims_email_column}, 
                ${db_names.claims_placeid_column},
                ${db_names.claims_eventid_column},
                ${db_names.claims_date_column}
            )
            values ('${email}','${place_id}','${event_id}',utc_timestamp())
            `
        )
    }
}