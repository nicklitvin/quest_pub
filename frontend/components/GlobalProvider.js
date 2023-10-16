import React from "react"
import { client, data_types, other_consts } from "../globalConstants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

export const GlobalContext = React.createContext();

/**
 * GlobalProvider provides all of its children access to its variables. Variables
 * are stored using React.useState and may optionally be saved to the device's 
 * storage. For consistency, contents in the global variable list must be one
 * of the following: String, Number, Function, Server_Response (no booleans)
 */
export const GlobalProvider = ({children}) => {
    // clear storage from previous app session, start off as if freshly installed
    const clear_async_storage = false;

    // use custom coordinates for quests/activity distances
    const insert_sample_coordinates = false;
    const sample_latitude = 37;
    const sample_longitude = -121;

    // forces app to go to loggedIn state, server must be disabled
    const force_loggedin = false;

    // logs global variables, specific variables specified in function
    const log_var_changes = false;

    const skip_tutorial = false;

    const [fetch_pending, set_fetch_pending] = React.useState(false);

    const fetch_func = async (url,request) => {
        if (fetch_pending) {
            return;
        }

        let data = null;
        set_fetch_pending(true);

        try {
            const bad_response = {ok: false};
            const response = await Promise.race([
                new Promise( (res) => setTimeout( () => res(bad_response), 1000)),
                fetch(url,request).catch(err => {return bad_response})
            ])
            if (response.ok) data = await response.json(); // type: client.server_response

            if (data && data.key) {
                await update_global(client.storage_key,data.key,true);
                await update_global(client.storage_loggedIn,client.true,true);
                await update_global(client.storage_show_modal,data.need_update);
            } else if (data) {
                await update_global(client.storage_key,"",true);
                await update_global(client.storage_loggedIn,client.false,true);
                await update_global(client.storage_show_modal,data.need_update);
            }
        } catch (err) {
            if (!other_consts.use_aws_ip) console.log(`fetch error`,err);
        }
        
        set_fetch_pending(false);
        return data;
    } 

    const update_location = async () => {
        let latitude = null;
        let longitude = null;

        if (insert_sample_coordinates) {
            latitude = sample_latitude;
            longitude = sample_longitude;
            update_global(client.storage_latitude, sample_latitude);
            update_global(client.storage_longitude, sample_longitude);
        } else {
            try {
                const { coords } = await Location.getCurrentPositionAsync();
                if (coords && coords.latitude && coords.longitude) {
                    latitude = coords.latitude;
                    longitude = coords.longitude
                    update_global(client.storage_latitude, latitude);
                    update_global(client.storage_longitude, longitude);
                }
            } catch (err) {}
        }
        const result = {
            latitude: latitude,
            longitude: longitude
        }
        return result;
    }

    const [global, setGlobal] = React.useState({
        [client.storage_fetch_func] : fetch_func,
        [client.storage_update_location]: update_location,

        [client.storage_loggedIn] : force_loggedin ? client.true : client.false,
        [client.storage_latitude]: insert_sample_coordinates ? sample_latitude : null,
        [client.storage_longitude]: insert_sample_coordinates ? sample_longitude : null,
        [client.storage_first_login] : client.true,

        [client.storage_theme]: client.theme_dark,
        [client.storage_date_format]: client.date_mmddyy,
        [client.storage_use_km]: client.false,
        [client.storage_show_modal]: false,

        [client.storage_response_claim]: {...data_types.response_claim},
        [client.storage_response_login]: {...data_types.response_login},
        [client.storage_response_locations]: {...data_types.response_place_list},
        [client.storage_response_events]: {...data_types.response_place_list},
        [client.storage_response_activity]: {...data_types.response_place_list},
    });

    const update_global = async (key, val, use_async_storage) => {
        if (use_async_storage) {
            let string_val = val;
            if (typeof(val) != "string") {
                string_val = JSON.stringify(val);
            }
            await AsyncStorage.setItem(key,string_val);
        }
        setGlobal( prevGlobal => ({
            ...prevGlobal,
            [key] : val
        }));
    }

    React.useEffect( () => {
        const func = async () => {
            if (log_var_changes) {
                console.log("global",global[client.storage_first_login]);
            }
        }
        func();
    }, [global])

    React.useEffect( () => {
        const func = async () => {
            if (clear_async_storage) await AsyncStorage.clear();

            const first_login = await AsyncStorage.getItem(client.storage_first_login);
            if (first_login == client.false || skip_tutorial)
                await update_global(client.storage_first_login, false);

            const quests = await AsyncStorage.getItem(client.storage_response_locations);
            if (quests) update_global(client.storage_response_locations, JSON.parse(quests));

            const events = await AsyncStorage.getItem(client.storage_response_events);
            if (events) update_global(client.storage_response_events, JSON.parse(events));

            const activity = await AsyncStorage.getItem(client.storage_response_activity);
            if (activity) update_global(client.storage_response_activity, JSON.parse(activity));

            const key = await AsyncStorage.getItem(client.storage_key);
            if (key) update_global(client.storage_key, key);

            const theme = await AsyncStorage.getItem(client.storage_theme);
            if (theme == client.theme_dark || theme == client.theme_light) 
                await update_global(client.storage_theme, theme);

            const use_km = await AsyncStorage.getItem(client.storage_use_km);
            if (use_km == client.false || use_km == client.true) 
                await update_global(client.storage_use_km, use_km);

            const date_format = await AsyncStorage.getItem(client.storage_date_format);
            if ([client.date_ddmmyy,client.date_mmddyy,client.date_yymmdd].indexOf(date_format) > -1)
                await update_global(client.storage_date_format, date_format); 
        }
        func();
    }, [])

    return(
        <GlobalContext.Provider value={{global,update_global}}>
            {children}
        </GlobalContext.Provider>
    )
}