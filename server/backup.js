import { db_init, db_names, data_types, other_consts, use_aws_ip } from "./globalConstants.js";
import dotenv from 'dotenv';
import mysql from "mysql2";
import { writeFile, readFile } from "fs/promises"

const interval_time = 1000 * 60 * 60 * 24; //every 24hr

export default class Backup {
    static folder = "backups"

    static pool;

    static make_database_connection() {
        dotenv.config();

        Backup.pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        }).promise();
    }

    static close_database_connection() {
        if (Backup.pool) {
            Backup.pool.end();
        }
    }

    static async make_empty_tables() {
        await Backup.run_sql(db_init);
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
                let output = await Backup.pool.query(command);

                if (operation == "select") {
                    result = output[0];
                }
            }
        } catch (err) {
            if (!use_aws_ip) console.log("bad sql command: ", curr_command)
        }
        return result;
    }

    static async write_into_file(filename,content) {
        const filepath = `${Backup.folder}/${filename}_${Date.now()}.sql`;
        await writeFile(filepath, content);
    }

    static get_datetime(value) {
        const dateObject = new Date(value);

        // Format the date components
        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Add 1 to month (0-based index)
        const day = String(dateObject.getDate()).padStart(2, "0");
        const hours = String(dateObject.getHours()).padStart(2, "0");
        const minutes = String(dateObject.getMinutes()).padStart(2, "0");
        const seconds = String(dateObject.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    static async create_user_sql() {
        let sql = 
        `
insert ignore into ${db_names.users_table} 
(
    ${db_names.users_email_column},
    ${db_names.users_key_column}
)
values
        `
        const users = await Backup.run_sql(`select * from ${db_names.users_table}`);

        for (let x of users) {
            const email = x[db_names.users_email_column];
            const account_key = x[db_names.users_key_column];
            const row = 
            `\n('${email}','${account_key}'),`;
            sql += row;
        }

        sql = sql.slice(0, sql.length - 1) + ";"
        await Backup.write_into_file(db_names.users_table,sql);
    }

    static async create_claim_sql() {
        let sql = 
        `
insert ignore into ${db_names.claims_table}
(
    ${db_names.claims_date_column},
    ${db_names.claims_email_column},
    ${db_names.claims_placeid_column},
    ${db_names.claims_eventid_column}
)
values
        `

        const claims = await Backup.run_sql(`select * from ${db_names.claims_table}`);

        for (let x of claims) {
            const time = Backup.get_datetime(x[db_names.claims_date_column]);
            const email = x[db_names.claims_email_column];
            const place_id = x[db_names.claims_placeid_column];
            const event_id = x[db_names.claims_eventid_column];

            const event_string = event_id == null ? null : `'${event_id}'`

            const row = 
            `\n('${time}','${email}','${place_id}', ${event_string}),`;
            sql += row;
        }
       
        sql = sql.slice(0, sql.length - 1) + ";"
        await Backup.write_into_file(db_names.claims_table,sql);
    }
}

const main = async () => {
    Backup.make_database_connection();
    await Backup.create_user_sql();
    await Backup.create_claim_sql();
    Backup.close_database_connection();
}

setInterval(main, interval_time);
main();