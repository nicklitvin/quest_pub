import React from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { client, other_consts } from "../globalConstants";
import { GlobalContext } from "../components/GlobalProvider";
import { theme_colors } from "../components/ThemeColors";
import Header from "../components/Header";
import { Activity, Link_Button, activity_settings } from "../components/Activity";

export default function PageEvents() {
    const {global, update_global} = React.useContext(GlobalContext);
    const [colors, setColors] = React.useState(theme_colors(global[client.storage_theme]));
    const [event_list, set_event_list] = React.useState([]);
    const [is_refreshing, set_is_refreshing] = React.useState(false);
    const [only_today, set_only_today] = React.useState(false);
    const [only_week, set_only_week] = React.useState(false);

    React.useEffect( () => {
        setColors(theme_colors(global[client.storage_theme]));
    }, [global[client.storage_theme]])

    React.useEffect( () => {
        filter_list();
    }, [
        global[client.storage_response_events], 
        colors, 
        global[client.storage_use_km],
        global[client.storage_date_format],
        only_today,
        only_week
    ])

    const remove_event = async (event_id) => {
        const event_response = {...global[client.storage_response_events]};
        const places = event_response.places;
        for (let i in places) {
            if (places[i].event_id == event_id) {
                places.splice(i,1);
                break;
            }
        }
        update_global(client.storage_response_events, event_response, true);
    }

    const claim_event = async (event_id) => {
        try {
            const content = {
                key: global[client.storage_key],
                latitude: global[client.storage_latitude],
                longitude: global[client.storage_longitude],
                event_id: event_id
            }
            const url = client.make_url(client.url_claim_event);
            const request = client.make_post_request(content);

            const response = await global[client.storage_fetch_func](url,request);
            if (response && response.valid) {
                remove_event(event_id);

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
            if (!other_consts.use_aws_ip) console.log(`claim quest err`,err);
        }
    }

    const does_satisfy_filter = (time) => {
        const event_time = new Date(time);
        const curr_time = Date.now();
        const diff = event_time - curr_time;
        const event_in_days = diff / (1000* 60 * 60 * 24);

        if (only_today) {
            return event_in_days <= 1
        } else if (only_week) {
            return event_in_days <= 7
        } else {
            return true;
        }
    }

    const filter_list = () => {
        const result = [];
        const places = global[client.storage_response_events].places;

        for (let i in places) {
            const place = places[i];
            const settings = {...activity_settings};

            if (!does_satisfy_filter(place.start_time)) continue;

            settings.colors = colors;
            settings.is_activity = false;
            settings.is_event = true;
            settings.use_web_link = [client.null,null].includes(place.web_link) ? false : true;
            settings.react_key = `Event-${i}-${place.title}`;
            settings.use_km = global[client.storage_use_km] == client.true;
            settings.date_format = global[client.storage_date_format];

            result.push(Activity(place,settings,claim_event));
        }
        set_event_list(result);
    }

    const on_refresh = async () => {
        const curr_location = await global[client.storage_update_location]();
        const content = {
            key: global[client.storage_key],
            latitude: curr_location.latitude || global[client.storage_latitude],
            longitude: curr_location.longitude || global[client.storage_longitude]
        };
        const request = client.make_post_request(content);
        const url = client.make_url(client.url_get_events);
        const data = await global[client.storage_fetch_func](
            url,request
        );

        if (data) {
            update_global(client.storage_response_events, data, true);
        }
        set_is_refreshing(false);
    }



    const option_filter = (setting) => {
        const is_selected = setting == client.text_events_filter_today ? only_today : only_week;

        return (
            <TouchableOpacity style={{
                ...styles.filter,
                backgroundColor: is_selected ? colors.cyan : colors.button,
                borderColor: is_selected ? colors.opp_button_border : colors.button_border
            }}
            onPress={ () => {
                if (setting == client.text_events_filter_today) {
                    set_only_today(!only_today);
                    set_only_week(false);
                } else {
                    set_only_week(!only_week);
                    set_only_today(false);
                }
            }}
            >
                <Text style={{
                    textAlign: "center", 
                    color: colors.text,
                    fontWeight: "bold"
                }}>{setting}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{flex: 1}}>
            <View>
                {Header(client.page_events,colors)}
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
                        {Link_Button(colors,client.page_events)}
                        <View style={styles.filter_view}>
                            {option_filter(client.text_events_filter_today)}
                            {option_filter(client.text_events_filter_week)}
                        </View>
                        <View style={styles.questList}>
                            {event_list}
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
    },
    filter_view: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center"
    },
    filter: {
        width: "48%",
        borderRadius: client.style_border_radius_1,
        marginTop: client.style_margin_top_quest,
        marginLeft: "1%",
        marginRight: "1%",
        borderWidth: 1,
        padding: client.style_padding_0,
    },
})