import { Image, Text, TouchableOpacity, View } from "react-native";
import { client, data_types} from "../globalConstants";
import { StyleSheet } from "react-native";
import React from "react";
import { GlobalContext } from "./GlobalProvider";
import { theme_colors } from "./ThemeColors";
import { Activity, activity_settings } from "./Activity";


export const Welcome = () => {
    return Tutorial(client.tutorial_page_welcome);
}

export const Types = () => {
    return Tutorial(client.tutorial_page_types)
}

export const Sights = () => {
    return Tutorial(client.tutorial_page_sights);
}

export const Events = () => {
    return Tutorial(client.tutorial_page_events);
}

export const Path = () => {
    return Tutorial(client.tutorial_page_path);
}

export const Profle = () => {
    return Tutorial(client.tutorial_page_profile);
}

export const Reload = () => {
    return Tutorial(client.tutorial_page_reload);
}

export const Settings = () => {
    return Tutorial(client.tutorial_page_settings);
}

export const Heart = () => {
    return Tutorial(client.tutorial_page_heart);
}


const make_sight = (colors) => {
    const result = {...data_types.activity};
    result.distance = 10000;
    result.id = "ChIJw____96GhYARCVVwg5cT7c0";
    result.title = "Golden Gate Bridge";

    const settings = {...activity_settings};
    settings.colors = colors;
    settings.is_activity = false;
    settings.is_event = false;
    settings.react_key = "tutorial-sight";

    return Activity(result,settings);
}

const make_event = (colors) => {
    const result = {...data_types.activity};
    result.distance = 10000;
    result.title = "Boston Marathon";
    result.web_link = "https://www.baa.org/races/boston-marathon";
    result.start_time = "2024-04-15T13:30:00.000Z"
    result.end_time = "2024-04-15T16:00:00.000Z"

    const settings = {...activity_settings};
    settings.colors = colors;
    settings.is_activity = false;
    settings.is_event = true;
    settings.react_key = "tutorial-event";
    settings.use_web_link = true;

    return Activity(result,settings);
}

const make_claim = (colors) => {
    const result = {...data_types.activity};
    result.distance = 0;
    result.place_id = "asd";
    result.title = "Golden Gate Bridge";
    result.web_link = "";

    const settings = {...activity_settings};
    settings.colors = colors;
    settings.is_activity = false;
    settings.is_event = false;
    settings.react_key = "tutorial-claim";

    return Activity(result,settings);
}

const make_activity = (colors) => {
    const result = {...data_types.activity};
    result.distance = 10000;
    result.id = "ChIJw____96GhYARCVVwg5cT7c0";
    result.title = "Golden Gate Bridge";
    result.date = "2023-02-15T23:00:00.000Z";

    const settings = {...activity_settings};
    settings.colors = colors;
    settings.is_activity = true;
    settings.is_event = false;
    settings.react_key = "tutorial-activity";

    return Activity(result,settings);
}

const make_go_home = (colors, finish_tutorial) => {
    return (
        <TouchableOpacity onPress={finish_tutorial} style={{
            ...styles.button,
            backgroundColor: colors.cyan,
            borderColor: colors.text,
            justifyContent: "center",
            padding: client.style_padding_0
        }}>
            <Text style={{...styles.button_text, color: colors.text}}>
                {client.tutorial_heart_button}
            </Text>
        </TouchableOpacity>
    )
}

const Tutorial = (page_name) => {
    const {global, update_global} = React.useContext(GlobalContext);
    const [colors, setColors] = React.useState(theme_colors(global[client.storage_theme]));
    let title, subtitle, component, image;

    const finish_tutorial = () => {
        update_global(client.storage_first_login, client.false, true);
    }

    switch (page_name) {
        case client.tutorial_page_welcome:
            title = client.tutorial_welcome_title;
            subtitle = client.tutorial_welcome_subtitle;
            image = require("../img/logo.png");
            break;
        case client.tutorial_page_types:
            title = client.tutorial_types_title;
            subtitle = client.tutorial_types_subtitle;
            image = require("../img/List.png");
            break;
        case client.tutorial_page_sights:
            title = client.tutorial_sights_title;
            subtitle = client.tutorial_sights_subtitle;
            image = require("../img/Quests.png");
            component = make_sight(colors);
            break;
        case client.tutorial_page_events:
            title = client.tutorial_events_title;
            subtitle = client.tutorial_events_subtitle;
            image = require("../img/Event.png");
            component = make_event(colors);
            break;
        case client.tutorial_page_path:
            title = client.tutorial_path_title;
            subtitle = client.tutorial_path_subtitle;
            image = require("../img/Path.png");
            component = make_claim(colors);
            break;
        case client.tutorial_page_profile:
            title = client.tutorial_profile_title;
            subtitle = client.tutorial_profile_subtitle;
            image = require("../img/Profile.png");
            component = make_activity(colors);
            break;
        case client.tutorial_page_reload:
            title = client.tutorial_reload_title;
            subtitle = client.tutorial_reload_subtitle;
            image = require("../img/Reload.png");
            break;
        case client.tutorial_page_settings:
            title = client.tutorial_settings_title;
            subtitle = client.tutorial_settings_subtitle;
            image = require("../img/Settings.png");
            break;
        case client.tutorial_page_heart:
            title = client.tutorial_heart_title;
            subtitle = client.tutorial_heart_subtitle;
            image = require("../img/Heart.png");
            component = make_go_home(colors, finish_tutorial);
            break;
    }

    return (
        <View style={{...styles.container, backgroundColor: colors.background}}>
            <View style={styles.content}>
                <Image source={image} 
                    style={{...styles.image, tintColor: colors.cyan}}
                />
                <Text style={{...styles.title, color: colors.text}}>{title}</Text>
                <Text style={{...styles.subtitle, color: colors.text}}>{subtitle}</Text>
                <View style={{...styles.component, borderColor: colors.background}}>
                    {component}
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        alignItems: "center"
    },
    content: {
        marginTop: client.style_margin_top_center,
        width: client.style_content_width,
        alignItems: "center"
    },
    title: {
        fontSize: client.style_font_size_1,
        fontWeight: "bold",
        marginTop: client.style_margin_top_content,
        textAlign: "center"
    },
    subtitle: {
        fontSize: client.style_font_size_3,
        fontWeight: "bold",
        marginTop: client.style_margin_top_content,
        textAlign: "center"
    },
    component: {
        marginTop: client.style_margin_top_content,
        width: "100%",
        borderWidth: 1,
        borderRadius: client.style_border_radius_1
    },
    button: {
        marginTop: client.style_margin_top_content,
        width: "100%",
        borderWidth: 1,
        borderRadius: client.style_border_radius
    },
    button_text: {
        fontSize: client.style_font_size_3,
        fontWeight: "bold",
        textAlign: "center"
    }
})