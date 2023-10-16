import { StyleSheet, Text, View, ScrollView, Image, TextInput, RefreshControl, TouchableOpacity } from "react-native";
import { client } from "../globalConstants";
import React from "react";
import { GlobalContext } from "../components/GlobalProvider";
import { theme_colors } from "../components/ThemeColors";
import Header from "../components/Header";
import { Activity, activity_settings } from "../components/Activity";

export default function PageProfile() {
    const {global, update_global} = React.useContext(GlobalContext);
    const [colors, setColors] = React.useState(theme_colors(global[client.storage_theme]));
    const [activities, set_activities] = React.useState([]);
    const [only_events, set_only_events] = React.useState(false);
    const [only_sights, set_only_sights] = React.useState(false);
    const [filter_text, set_filter_text] = React.useState("");

    React.useEffect( () => {
        setColors(theme_colors(global[client.storage_theme]));
    }, [global[client.storage_theme]])

    React.useEffect( () => {
        filterList();
    }, [
        global[client.storage_response_activity],
        colors,
        global[client.storage_date_format], 
        global[client.storage_use_km],
        only_events,
        only_sights,
        filter_text
    ])

    const filterList = () => {
        let filter = filter_text;
        const result = [];
        const activities = global[client.storage_response_activity].places;

        for (let i in activities) {
            const activity = activities[i];
            const title = activity.title.toLowerCase();
            if (only_events && [null,client.null].includes(activity.event_id)) {
                continue;
            } else if (only_sights && ![null,client.null].includes(activity.event_id)) {
                continue;
            }


            filter = filter.toLowerCase();
            if (title.indexOf(filter) > -1) {
                const settings = {...activity_settings};
                settings.colors = colors;
                settings.date_format = global[client.storage_date_format];
                settings.is_activity = true;
                settings.react_key = `activity-${i}-${activity.title}`;
                settings.use_km = global[client.storage_use_km] == client.true;

                result.push(Activity(activity,settings));
            }
        }
        set_activities(result);
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
        const url = client.make_url(client.url_get_user_activity);
        const data = await global[client.storage_fetch_func](
            url,request
        );

        if (data) {
            update_global(client.storage_response_activity, data, true);
        }

        set_is_refreshing(false);
    }

    const option_filter = (setting) => {
        const is_selected = setting == client.text_profile_only_events ? only_events : only_sights;

        return (
            <TouchableOpacity style={{
                ...styles.filter,
                backgroundColor: is_selected ? colors.cyan : colors.button,
                borderColor: is_selected ? colors.opp_button_border : colors.button_border
            }}
            onPress={ () => {
                if (setting == client.text_profile_only_events) {
                    set_only_events(!only_events);
                    set_only_sights(false);
                } else {
                    set_only_sights(!only_sights);
                    set_only_events(false);
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
                {Header(client.page_profile,colors)}
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
                    <View style={styles.content} >
                        <TextInput onChangeText={(text) => set_filter_text(text)} 
                            placeholder={client.text_profile_search_placeholder} 
                            style={{
                                ...styles.search, color: colors.text, backgroundColor: colors.button,
                                borderColor: colors.button_border
                            }} placeholderTextColor={colors.button_border}
                        />
                        <View style={styles.filter_view}>
                            {option_filter(client.text_profile_only_events)}
                            {option_filter(client.text_profile_only_sights)}
                        </View>
                        <View style={styles.activityList}>
                            {activities}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    centerer: {
        width: "100%",
        alignItems: "center"
    },
    content: {
        width: client.style_content_width,
        height: "100%",
        alignItems: "center",
        marginTop: client.style_margin_top_content
    },
    search: {
        width: "100%",
        borderRadius: client.style_border_radius_1,
        marginTop: client.style_margin_top_quest,
        borderWidth: 1,
        padding: client.style_padding_0,
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
    activityList: {
        width: "100%",
        marginBottom: client.style_margin_top_content
    }
})