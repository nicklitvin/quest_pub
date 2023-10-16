import { writeFile, readFile } from "fs/promises"
import { db_names } from "../globalConstants.js"

/**
 * Running this file creates a sql file from all the locations specified
 * in the json file list (duplicates are not included). Sql file will
 * allow insertion into database with the appropriate values.
 */

const file_paths = ["1.json","2.json","3.json","4.json","5.json","6.json","7.json"];
const db_name = "db";

const make_sql_insert = async () => {
    let result = `insert ignore into ${db_names.locations_table} 
    (
        ${db_names.locations_title_column},
        ${db_names.locations_latitude_column},
        ${db_names.locations_longitude_column},
        ${db_names.locations_radius_column},
        ${db_names.locations_placeid_column}
    )
    values \n`;

    let added = new Set();

    for (let file_path of file_paths) {
        let content = await readFile(file_path, "utf8");
        let parsed = JSON.parse(content);
        let results = parsed.results;
    
        for (let row of results) {
            const place_id = row.place_id;
    
            if (added.has(place_id)) {
                continue
            } else {
                added.add(place_id);
            }
    
            const row_name = row.name.replace(/'/g, "\\'");
            const center = row.geometry.location;
            const radius = 50;
    
            result += `('${row_name}',${Number(center.lat)},${Number(center.lng)},${radius},'${place_id}'),\n`;
        }
    }
    
    result = result.slice(0, result.length - 2) + ";";
    return result;
}

const make_sql_file = async () => {
    const sql_path = `${Date.now()}.sql`
    const insert = await make_sql_insert();

    let content = `
        use ${db_name};
        create table ${db_names.locations_table} (
            ${db_names.locations_title_column} ${db_names.data_varchar},
            ${db_names.locations_latitude_column} ${db_names.data_decimal},
            ${db_names.locations_longitude_column} ${db_names.data_decimal},
            ${db_names.locations_radius_column} ${db_names.data_decimal},
            ${db_names.locations_placeid_column} ${db_names.data_varchar} key primary
        );
        ${insert}
    `

    try {
        await writeFile(sql_path,content);
    } catch(err) {
        console.log(err);
    }
}

make_sql_file();