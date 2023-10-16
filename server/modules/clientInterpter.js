import db from "./dbManager.js";
import { data_types, other_consts } from "../globalConstants.js";
import jwtDecode from "jwt-decode";

/**
 * ClientInterpter methods are called by FetchManager and are meant to represent the
 * select functions that a user is able to do. All functions generate a
 * response to send back to the user with data to display or store.
 */
export default class ClientInterpreter {

    static is_need_update (version) {
        if (version && other_consts.valid_versions.indexOf(version) == -1) {
            return true
        } else {
            return false; 
        }
    }

    static async login_with_token(token, user_info = null, is_apple = false, version=null) {
        const response = {...data_types.response_login};
        response.need_update = this.is_need_update(version);
        if (response.need_update == true) return response

        if (!user_info) {
            if (is_apple) {
                try {
                    const ios_decoded = jwtDecode(token);
                    user_info = {
                        email: ios_decoded.email
                    };
                } catch (err) {}
            } else {
                const google_response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
                    headers: {"Authorization": `Bearer ${token}`}
                })
                user_info = await google_response.json();  
            }
        }

        if (user_info && user_info.email) {
            const email_taken = await db.is_email_taken(user_info.email,false);
            if (email_taken) {
                response.key = await db.get_key_from_email(db.make_encrypted(user_info.email));
            } else {
                response.key = await db.make_user(user_info.email,token);
            }
        }

        return response;
    }

    static async login_with_key(key, version=null) {
        const response = {...data_types.response_login};
        response.need_update = this.is_need_update(version);
        if (response.need_update == true) {
            response.key = key;
            return response
        }
        
        const email = await db.get_email_from_key(key);
        if (email) {
            response.key = key;
        }

        return response;
    }

    static async get_locations(key,latitude,longitude, version=null) {
        const response = {...data_types.response_place_list};
        response.need_update = this.is_need_update(version);
        if (response.need_update == true) {
            response.key = key;
            return response
        }
        
        const email = await db.get_email_from_key(key);
        
        response.places = await db.get_locations(email,latitude,longitude);
        response.key = key;

        return response
    }

    static async get_events(key,latitude,longitude, version=null) {
        const response = {...data_types.response_place_list};
        response.need_update = this.is_need_update(version);
        if (response.need_update == true) {
            response.key = key;
            return response
        }

        const email = await db.get_email_from_key(key);
        if (email) {
            response.key = key;
            response.places = await db.get_events(email,latitude,longitude);
        }

        return response;
    }

    static async claim_location(key,place_id,latitude,longitude, version=null) {
        const response = {...data_types.response_claim};
        response.need_update = this.is_need_update(version);
        if (response.need_update == true) {
            response.key = key;
            return response
        }

        const email = await db.get_email_from_key(key);
        if (
            email && 
            await db.is_location_claim_valid(email,latitude,longitude,place_id)
        ) {
            await db.insert_location_claim(email,place_id);
            response.key = key;
            response.valid = true;
        } else if (email) {
            response.key = key;
        }

        return response;
    }

    static async claim_event(key, event_id, latitude, longitude, version=null) {
        const response = {...data_types.response_claim};
        response.need_update = this.is_need_update(version);
        const email = await db.get_email_from_key(key);
        if (response.need_update == true) {
            response.key = key;
            return response
        }

        if (
            email && 
            await db.is_event_happening(event_id) &&
            await db.is_event_claim_valid(email,latitude,longitude,event_id)
        ) {
            const place_id = await db.get_placeid_from_eventid(event_id);

            await db.insert_event_claim(email,place_id,event_id);
            response.key = key;
            response.valid = true;
        } else if (email) {
            response.key = key;
        }
        return response;
    }

    static async get_user_activity(key,latitude,longitude, version=null) {
        const response = {...data_types.response_place_list};
        response.need_update = this.is_need_update(version);
        if (response.need_update == true) {
            response.key = key;
            return response
        }

        const email = await db.get_email_from_key(key);
        if (email) {
            response.key = key;
            response.places = await db.get_user_activity(email,latitude,longitude);
        }

        return response;
    }

    static async get_all(key,latitude,longitude, version=null) {
        const response = {...data_types.response_all};
        response.need_update = this.is_need_update(version);
        if (response.need_update == true) {
            response.key = key;
            return response
        }

        const email = await db.get_email_from_key(key);
        if (email) {
            response.key = key;
            response.activity = await ClientInterpreter.get_user_activity(key,latitude,longitude);
            response.locations = await ClientInterpreter.get_locations(key,latitude,longitude);
            response.events = await ClientInterpreter.get_events(key, latitude, longitude);
        }

        return response;
    }

    static async delete_account(key, version=null) {
        const response = {...data_types.response_delete};
        response.need_update = this.is_need_update(version);
        if (response.need_update == true) {
            response.key = key;
            return response
        }

        const email = await db.get_email_from_key(key);
        if (email) {
            await db.delete_user(email);
            response.valid = true;
        }

        return response;
    }
}