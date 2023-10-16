import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();

import React from "react";
import { GlobalContext } from "../components/GlobalProvider";
import { theme_colors } from "../components/ThemeColors";
import { Image } from "react-native";
import { client } from "../globalConstants";

import PageQuests from "./PageQuests";
import PageProfile from "./PageProfile";
import PageSettings from "./PageSettings";
import PageEvents from './PageEvents';

import { ModalContext } from '../components/ModalProvider';

export default function LoggedIn() {
    const {set_show_modal} = React.useContext(ModalContext);
    const {global, update_global} = React.useContext(GlobalContext);
    const colors = theme_colors(global[client.storage_theme]);
    const [first_load, set_first_load] = React.useState(true);
    const initial_page = client.page_events;

    const groups = [
        [client.page_quests, require("../img/Quests.png")],
        [client.page_profile, require("../img/Profile.png")],
        [client.page_settings, require("../img/Settings.png")],
        [client.page_events, require("../img/Event.png")]
    ];

    React.useEffect( () => {
        const func = async () => {
            if (first_load && global[client.storage_loggedIn] == client.true) {
                set_first_load(false);
                const coords = await global[client.storage_update_location]();

                const content = {
                    key: global[client.storage_key],
                    latitude: coords.latitude || global[client.storage_latitude],
                    longitude: coords.longitude || global[client.storage_longitude]
                }
                const request = client.make_post_request(content);
                const url = client.make_url(client.url_get_all);
                const response = await global[client.storage_fetch_func](
                    url, request
                )
        
                if (response && response.key) {
                    update_global(client.storage_key, response.key, true);
                    update_global(client.storage_response_locations, response.locations, true);
                    update_global(client.storage_response_activity, response.activity, true);
                    update_global(client.storage_response_events, response.events, true);
                }
            }
        }
        func();
    }, [global[client.storage_loggedIn]])

    React.useEffect( () => {
        set_show_modal(global[client.storage_show_modal]);
    }, [global[client.storage_show_modal]])

    return (
        <Tab.Navigator 
            tabBarPosition="bottom"
            initialRouteName={initial_page}
            
            screenOptions = { ({route}) => ({
                tabBarPressColor: colors.theme == client.theme_dark ? null : colors.background,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.text,
                    borderTopWidth: 1,
                },
                tabBarIndicatorStyle: {
                    display: "none"
                },
                tabBarIcon: ({focused}) => {
                    let img_source;
                    switch (route.name) {
                        case (client.page_quests):
                            img_source = groups[0][1];
                            break;
                        case (client.page_profile):
                            img_source = groups[1][1];
                            break;
                        case (client.page_settings):
                            img_source = groups[2][1];
                            break;
                        case (client.page_events):
                            img_source = groups[3][1];
                            break;
                    }

                    return <Image source={img_source} 
                        style={{
                            width: client.style_image_bottom_buttons, 
                            height: client.style_image_bottom_buttons, 
                            tintColor: focused ? colors.cyan : colors.text
                        }}
                    />
                },
            })}
        >
            <Tab.Screen name={client.page_events} component={PageEvents} 
                options={{tabBarLabel: () => null}} 
            />
            <Tab.Screen name={client.page_quests} component={PageQuests} 
                options={{tabBarLabel: () => null}}
            />
            <Tab.Screen name={client.page_profile} component={PageProfile} 
                options={{tabBarLabel: () => null}}
            />
            <Tab.Screen name={client.page_settings} component={PageSettings} 
                options={{tabBarLabel: () => null}}
            />
        </Tab.Navigator>
    )
}