import React from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { client } from "../globalConstants";
import { GlobalContext } from "../components/GlobalProvider";
import { theme_colors } from "../components/ThemeColors";
import Header from "../components/Header";
import { Activity, Link_Button, activity_settings } from "../components/Activity";

export default function PageQuests() {
    const {global, update_global} = React.useContext(GlobalContext);
    const [colors, setColors] = React.useState(theme_colors(global[client.storage_theme]));
    const [quest_list, set_quest_list] = React.useState([]);

    React.useEffect( () => {
        setColors(theme_colors(global[client.storage_theme]));
    }, [global[client.storage_theme]])

    React.useEffect( () => {
        filter_list();
    }, [
        global[client.storage_response_locations], 
        colors, 
        global[client.storage_use_km]
    ])

    const remove_quest = async (place_id) => {
        const loc_response = {...global[client.storage_response_locations]};
        const places = loc_response.places;
        for (let i in places) {
            if (places[i].id == place_id) {
                places.splice(i,1);
                break;
            }
        }
        update_global(client.storage_response_locations, loc_response, true);
    }

    const claim_quest = async (place_id) => {
        try {
            const content = {
                key: global[client.storage_key],
                latitude: global[client.storage_latitude],
                longitude: global[client.storage_longitude],
                place_id: place_id
            }
            const url = client.make_url(client.url_claim_location);
            const request = client.make_post_request(content);

            const response = await global[client.storage_fetch_func](url,request);
            if (response && response.valid) {
                remove_quest(place_id);

                const content = {
                    key: global[client.storage_key],
                    latitude: global[client.storage_latitude],
                    longitude: global[client.storage_longitude]
                }
                const request = client.make_post_request(content);
                const url = client.make_url(client.url_get_user_activity);

                const data = await global[client.storage_fetch_func](url,request);
                if (data) update_global(client.storage_response_activity, data, true);
            }
        } catch (err) {
            if (!use_aws_ip) console.log(`claim quest err`,err);
        }
    }

    const filter_list = () => {
        const result = [];
        const places = global[client.storage_response_locations].places;

        result.push(Link_Button(colors,client.page_quests))

        for (let i in places) {
            const place = places[i];
            const settings = {...activity_settings};
            settings.colors = colors;
            settings.is_activity = false;
            settings.is_event = false;
            settings.react_key = `Location-${i}-${place.title}`;
            settings.use_km = global[client.storage_use_km] == client.true;

            result.push(Activity(place,settings,claim_quest));
        }
        set_quest_list(result);
    }

    const [is_refreshing, set_is_refreshing] = React.useState(false);

    const on_refresh = async () => {
        const curr_location = await global[client.storage_update_location]();
        const content = {
            key: global[client.storage_key],
            latitude: curr_location.latitude || global[client.storage_latitude],
            longitude: curr_location.longitude || global[client.storage_longitude]
        };
        const request = client.make_post_request(content);
        const url = client.make_url(client.url_get_locations);
        const data = await global[client.storage_fetch_func](
            url,request
        );

        if (data) {
            update_global(client.storage_response_locations, data, true);
        }
        set_is_refreshing(false);
    }

    return (
        <View style={{flex: 1}}>
            <View>
                {Header(client.page_quests,colors)}
            </View>
            <ScrollView 
                style={{...styles.container, backgroundColor: colors.background}} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing = {is_refreshing}
                        onRefresh = {on_refresh}   
                    />
                }
            >
                <View style={styles.centerer}>
                    <View style={styles.content}>
                        <View style={styles.questList}>
                            {quest_list}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%"
    },
    centerer: {
        width: "100%",
        alignItems: "center",
        marginTop: client.style_margin_top_content,
    },
    content: {
        width: client.style_content_width,
        height: "100%",
        alignItems: "center",
    },
    questList: {
        width: "100%",
        marginBottom: client.style_margin_top_content
    }
})