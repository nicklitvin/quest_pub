import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { client, data_types, other_consts } from "../globalConstants";
import { getCalendars } from "expo-localization";

export const Link_Button = (colors,page) => {
    let link, title, subtitle;

    switch (page) {
        case client.page_events:
            link = client.url_form_event;
            title = client.text_events_suggest_title;
            subtitle = client.text_events_suggest_subtitle;
            break;
        case client.page_quests:
            link = client.url_form_sight; 
            title = client.text_quests_suggest_title;
            subtitle = client.text_quests_suggest_subtitle;
            break;
    }

    const open_link = () => {
        try {
            Linking.openURL(link);
        } catch (err) {}
    }

    return (
        <TouchableOpacity onPress={open_link} key={`link-${link}`} style={{
            ...styles.claim_container, 
            backgroundColor: colors.button, 
            borderColor: colors.cyan
        }}>
            <View style={styles.content}>
                <Text style={{...styles.title, color: colors.cyan}}>{title}</Text>
                <Text style={{...styles.subtitle, color: colors.cyan}}>{subtitle}</Text>
            </View>
        </TouchableOpacity>
    )
}

export const activity_settings = {
    is_activity: false,
    is_event: false,
    use_web_link: false,

    use_km: false,
    date_format: client.date_mmddyy,
    colors: null,

    react_key: null
}

export const Activity = (my_data,my_settings,claim_func=() => {}) => {
    let settings = {...activity_settings};
    if (my_settings) settings = my_settings;

    let data = {...data_types.activity};
    if (my_data) data = my_data;

    const open_link = async () => {
        let is_valid = false;
        try {
            if (
                typeof(data.web_link) == "string" && 
                data.web_link.length > 6 && (
                    data.web_link.slice(0,7) == 'http://' || 
                    data.web_link.slice(0,8) == 'https://'
                )
            ) {
                is_valid = true
            } 
        } catch (err) {}

        if (settings.use_web_link && is_valid) {
            Linking.openURL(data.web_link);
        } else {
            const url = client.make_maps_request_url(data.id);
            Linking.openURL(url);
        }
    }

    const extract_time = (date) => {
        const time_zone = getCalendars()[0].timeZone;
        const date_object = new Date(date);
        const local_date = date_object.toLocaleDateString(undefined,{
            day:"2-digit",month:"2-digit",year:"numeric",
            hour: "numeric", minute: "numeric", timeZone: time_zone
        });

        const parts = local_date.split(", ");
        const datePart = parts[0];
        const timePart = parts[1].replace(" ", "").toLowerCase();

        const [monthStr, dayStr, yearStr] = datePart.split("/");
        const month = String(parseInt(monthStr, 10)).padStart(2, '0'); 
        const day = String(parseInt(dayStr, 10)).padStart(2, '0');     
        const year = parseInt(yearStr, 10);  
        
        const time_parts = timePart.split(":");
        const hours = time_parts[0];
        const minutes = time_parts[1];

        return {
            day: day,
            month: month,
            year: year,
            hour: hours,
            minute: minutes
        }
    }

    const make_claim_text = () => {
        const time = extract_time(data.date);

        switch (settings.date_format) {
            case (client.date_ddmmyy):
                return `Claimed on ${time.day}/${time.month}/${time.year}`;
            case (client.date_mmddyy):
                return `Claimed on ${time.month}/${time.day}/${time.year}`;
            default:
                return `Claimed on ${time.year}/${time.month}/${time.day}`;
        }
    }

    const make_event_date_text = () => {
        const start = extract_time(data.start_time);
        const end = extract_time(data.end_time);

        let start_text, end_text;

        switch (settings.date_format) {
            case (client.date_ddmmyy):
                start_text = `${start.day}/${start.month}`;
                end_text = `${end.day}/${end.month}`;
                break;
            case (client.date_mmddyy):
                start_text = `${start.month}/${start.day}`;
                end_text = `${end.month}/${end.day}`;
                break;
            default:
                start_text = `${start.month}/${start.day}`;
                end_text = `${end.month}/${end.day}`;
                break;
        }

        return `${start_text} ${start.hour}:${start.minute} - ${end_text} ${end.hour}:${end.minute}`;
    }

    const make_distance_text = (distance) => {
        let val = distance.toFixed(1);
        if (val == 0 && !settings.is_event && !settings.is_activity) val = 0.1;

        if (settings.use_km) {
            return `${val}km.`
        } else {
            return `${val}mi.`
        }
    }

    const distance = Number(data.distance) * 
        (   
            settings.use_km ? 
            other_consts.meter_to_km : 
            other_consts.meter_to_mile
        )
    ;

    if (settings.is_activity) {
        return (
            <TouchableOpacity onPress={() => open_link()} key={settings.react_key} style={{
                ...styles.claim_container, 
                backgroundColor: settings.colors.button, 
                borderColor: settings.colors.button_border
            }}>
                <View style={styles.content}>
                    <Text style={{...styles.title, color: settings.colors.text}}>{data.title}</Text>
                    <Text style={{...styles.subtitle, color: settings.colors.text}}>{make_distance_text(distance)}</Text>
                    <Text style={{...styles.subtitle, color: settings.colors.text}}>{make_claim_text()}</Text>
                </View>
            </TouchableOpacity>
        )
    } else if (distance == 0 && ([null,client.null].includes(data.event_id) || data.is_happening)) {
        return (
            <TouchableOpacity onPress={() => claim_func(settings.is_event ? data.event_id : data.id)} key={settings.react_key} style={{
                ...styles.claim_container, 
                backgroundColor: settings.colors.cyan, 
                borderColor: settings.colors.text
            }}>
                <View style={styles.content}>
                    <Text style={{...styles.title, color: settings.colors.text}}>{data.title}</Text>
                    <Text style={{...styles.subtitle, color: settings.colors.text}}>{client.text_quests_claimnow}</Text>
                </View>
            </TouchableOpacity>
        )
    } else if (settings.is_event) {
        return (
            <TouchableOpacity onPress={() => open_link()} key={settings.react_key} style={{
                ...styles.claim_container, 
                backgroundColor: settings.colors.button, 
                borderColor: settings.colors.button_border
            }}>
                <View style={styles.content}>
                    <Text style={{...styles.title, color: settings.colors.text}}>{data.title}</Text>
                    <Text style={{...styles.subtitle, color: settings.colors.text}}>{make_distance_text(distance)}</Text>
                    <Text style={{...styles.subtitle, color: settings.colors.text}}>{make_event_date_text()}</Text>
                </View>
            </TouchableOpacity>
        )
    } else {
        return (
            <TouchableOpacity onPress={() => open_link()} key={settings.react_key} style={{
                ...styles.claim_container, 
                backgroundColor: settings.colors.button, 
                borderColor: settings.colors.button_border
            }}>
                <View style={styles.content}>
                    <Text style={{...styles.title, color: settings.colors.text}}>{data.title}</Text>
                    <Text style={{...styles.subtitle, color: settings.colors.text}}>{make_distance_text(distance)}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: client.style_border_radius_1,
        alignItems: "center",
        marginTop: client.style_margin_top_quest,
        borderWidth: 1
    },
    claim_container: {
        width: "100%",
        backgroundColor: client.dark_cyan,
        borderRadius: client.style_border_radius_1,
        alignItems: "center",
        marginTop: client.style_margin_top_quest,
        borderWidth: 1
    },
    content: {
        width: "80%"
    },
    arrow: {
        width: 25,
        height: 25,
        position: "absolute",
        right: 0,
        top: 0
    },
    title: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: client.style_font_size_1,
        marginTop: 5,
        marginBottom: 5
    },
    subtitle: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: client.style_font_size_3,
        marginBottom: 5
    }, 
})