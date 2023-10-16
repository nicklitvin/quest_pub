export const use_aws_ip = false;

export const other_consts = {
    location_num_responses: 100,
    valid_versions: ["2.0.0"]
}

export const db_names = {
    unix_time_start: "1970-01-01 00:00:00",
    db_unique_key: "primary key",
    database_name: "db_2",
    data_varchar: "varchar(255)",
    data_decimal: "decimal(10,5)",
    data_date: "datetime",

    users_table: "users",
    users_key_column: "account_key",
    users_email_column: "email",

    locations_table: "locations",
    locations_title_column: "title",
    locations_latitude_column: "latitude",
    locations_longitude_column: "longitude",
    locations_radius_column: "radius",
    locations_placeid_column: "place_id",
    locations_distance_alias: "distance",

    events_table: "events",
    events_start_time_column: "start_time",
    events_end_time_column: "end_time",
    events_link_column: "link",
    events_id_column: "event_id",

    claims_table: "claims",
    claims_date_column: "claim_date",
    claims_email_column: "email",
    claims_placeid_column: "place_id",
    claims_eventid_column: "event_id"
}

export const data_types = {
    activity: {
        title: "",
        latitude: "",
        longitude: "",
        distance: "",
        radius: null,
        id: null,

        start_time: null,
        end_time: null,
        web_link: null,
        event_id: null,
        is_happening: null, 

        date: null,
    },

    response_login : {
        key: null,
        need_update: true
    },
    response_place_list: {
        key: null,
        places: [],
        need_update: true
    },
    response_claim: {
        key: null,
        valid: false,
        need_update: true
    },
    response_all: {
        key: null,
        locations: null,
        events: null,
        activity: null,
        need_update: true
    },
    response_delete: {
        key: null,
        valid: false,
        need_update: true
    },
}

export const client = {
    express_port_number: 3001,

    url_token_login: "/tokenLogin",
    url_key_login: "/keyLogin",
    url_claim_location: "/claimLocation",
    url_claim_event: "/claimEvent",
    url_delete_account: "/deleteAccount",
    url_get_locations: "/getLocations",
    url_get_events: "/getEvents",
    url_get_user_activity: "/getActivity",
    url_get_all: "/getAll",
}

export const db_init = 
    `
    use ${db_names.database_name};

    drop table if exists ${db_names.users_table};
    create table ${db_names.users_table} (
        ${db_names.users_key_column} ${db_names.data_varchar},
        ${db_names.users_email_column} ${db_names.data_varchar},

        ${db_names.db_unique_key} (${db_names.users_email_column})
    );

    drop table if exists ${db_names.locations_table};
    create table ${db_names.locations_table} (
        ${db_names.locations_title_column} ${db_names.data_varchar},
        ${db_names.locations_latitude_column} ${db_names.data_decimal},
        ${db_names.locations_longitude_column} ${db_names.data_decimal},
        ${db_names.locations_radius_column} ${db_names.data_decimal},
        ${db_names.locations_placeid_column} ${db_names.data_varchar},
        ${db_names.db_unique_key} (${db_names.locations_placeid_column})
    );

    drop table if exists ${db_names.claims_table};
    create table ${db_names.claims_table} (
        ${db_names.claims_date_column} ${db_names.data_date},
        ${db_names.claims_email_column} ${db_names.data_varchar},
        ${db_names.claims_placeid_column} ${db_names.data_varchar},
        ${db_names.claims_eventid_column} ${db_names.data_varchar}
    );

    drop table if exists ${db_names.events_table};
    create table ${db_names.events_table} (
        ${db_names.locations_title_column} ${db_names.data_varchar},
        ${db_names.locations_latitude_column} ${db_names.data_decimal},
        ${db_names.locations_longitude_column} ${db_names.data_decimal},
        ${db_names.locations_radius_column} ${db_names.data_decimal},
        ${db_names.locations_placeid_column} ${db_names.data_varchar},
        
        ${db_names.events_start_time_column} ${db_names.data_date},
        ${db_names.events_end_time_column} ${db_names.data_date},
        ${db_names.events_link_column} ${db_names.data_varchar},
        ${db_names.events_id_column} ${db_names.data_varchar},

        ${db_names.db_unique_key} (${db_names.events_id_column})
    );
    `;
