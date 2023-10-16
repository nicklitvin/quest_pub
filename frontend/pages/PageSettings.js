import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, Button } from "react-native";
import { client } from "../globalConstants";
import React from "react";
import { GlobalContext } from "../components/GlobalProvider";
import * as Linking from "expo-linking";
import { theme_colors } from "../components/ThemeColors";
import Header from "../components/Header";

export default function PageSettings() {
    const {global, update_global} = React.useContext(GlobalContext);
    const [colors, setColors] = React.useState(theme_colors(global[client.storage_theme]));
    const [is_delete_visible, set_is_delete_visible] = React.useState(false);

    React.useEffect( () => {
        setColors(theme_colors(global[client.storage_theme]));
    }, [global[client.storage_theme]])

    const redirect_to_privacy = async () => {
        Linking.openURL(client.url_privacy);
    }

    const delete_account = async () => {
        try {
            const content = {
                key: global[client.storage_key],
            }
            const url = client.make_url(client.url_delete_account);
            const request = client.make_post_request(content);
            await global[client.storage_fetch_func](url,request);
            set_is_delete_visible(false);
        } catch (err) {}
    }

    const log_out = () => {
        update_global(client.storage_key, "", true);
        update_global(client.storage_loggedIn, client.false, true);
    }

    const use_theme = async (theme) => {
        await update_global(client.storage_theme, theme, true);
    }

    const use_km = async (yes) => {
        await update_global(client.storage_use_km, yes == true ? client.true : client.false, true);
    }

    const use_date = async (date) => {
        await update_global(client.storage_date_format, date, true);
    }

    const make_setting_row = (title, func, selected) => {
        return (
            <View style={styles.setting_row}>
                <Text style={{...styles.setting_text, color: colors.text}}>
                    {title}
                </Text>
                <TouchableOpacity onPress={func}>
                    <Image source={selected ? require("../img/Circle.png") : require("../img/EmptyCircle.png")} 
                        style={{...styles.setting_circle, tintColor: colors.cyan}}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    const make_setting_header = (title) => {
        return (
            <Text style={{...styles.setting_header, color : colors.text}}>{title}</Text>
        )
    }

    const show_tutorial = () => {
        update_global(client.storage_first_login,client.true);
    }

    const make_bottom_content = () => {
        return (
            <View>
                <TouchableOpacity 
                    style={{
                        ...styles.account_button, 
                        backgroundColor: colors.button, 
                        borderColor: colors.cyan,
                        borderWidth: 1
                    }} 
                    onPress={show_tutorial}
                >
                    <Text style={{...styles.account_button_text, color: colors.cyan}}>
                        {client.text_settings_tutorial_text}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={{
                        ...styles.account_button, backgroundColor: colors.cyan
                    }} 
                    onPress={log_out}
                >
                    <Text style={{...styles.account_button_text, color: colors.text}}>
                        {client.text_settings_logout}
                    </Text>
                </TouchableOpacity>

                <>
                    <TouchableOpacity style={{
                        ...styles.account_button,
                        backgroundColor: colors.error
                    }} onPress={() => set_is_delete_visible(true)}>
                        <Text style={{...styles.account_button_text, color: colors.text}}>
                            {client.text_settings_delete_button}
                        </Text>
                    </TouchableOpacity>
                    <Modal transparent={true} visible={is_delete_visible} animationType="fade" statusBarTranslucent={true} >
                        <View style={{
                            ...styles.delete_modal,
                        }}>
                            <View style={{
                                ...styles.delete_view,
                                backgroundColor: colors.button,
                            }}>
                                <Text style={{
                                    ...styles.delete_title,
                                    color: colors.text
                                }}>
                                    {client.text_settings_delete_title}
                                </Text>
                                <TouchableOpacity style={{width: "100%"}} onPress={delete_account}>
                                    <Text style={{
                                        ...styles.delete_text,
                                        color: colors.error,
                                        borderColor: colors.button_border
                                    }}>
                                        {client.text_settings_delete_confirm}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{width: "100%"}} onPress={() => set_is_delete_visible(false)}>
                                    <Text style={{
                                        ...styles.delete_text,
                                        color: colors.text,
                                        borderColor: colors.button_border
                                    }}>
                                        {client.text_settings_delete_cancel}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </>

                <TouchableOpacity onPress={redirect_to_privacy}>
                    <Text style={{
                        ...styles.info_text,
                        color: colors.text,
                        textDecorationLine: "underline"
                    }}>
                        {client.text_settings_app_support}
                    </Text>                        
                </TouchableOpacity>
                <Text style={{...styles.info_text, color: colors.text}}>
                    {client.text_settings_app_version}
                </Text>
            </View>
        )
    }

    return (
        <View style={{flex: 1}}>
            <View>
                {Header(client.page_settings,colors)}
            </View>
            <ScrollView 
                style={{...styles.container, backgroundColor: colors.background}} 
                showsVerticalScrollIndicator={false} 
            >
                <View style={styles.centerer}>
                    <View style={styles.content}>
                        <View style={styles.setting_section}>
                            {make_setting_header(client.text_settings_distance_header)}
                            {make_setting_row(client.text_settings_distance_km, () => use_km(true), global[client.storage_use_km] == "true")}
                            {make_setting_row(client.text_settings_distance_mi, () => use_km(false), global[client.storage_use_km] == "false")}
                        </View>
                        <View style={styles.setting_section}>
                            {make_setting_header(client.text_settings_appearance_header)}
                            {make_setting_row(client.text_settings_appearance_light, () => use_theme(client.theme_light), global[client.storage_theme] == client.theme_light)}
                            {make_setting_row(client.text_settings_appearance_dark, () => use_theme(client.theme_dark), global[client.storage_theme] == client.theme_dark)}
                        </View>
                        <View style={styles.setting_section}>
                            {make_setting_header(client.text_settings_date_header)}
                            {make_setting_row(client.text_settings_date_ddmmyy, () => use_date(client.date_ddmmyy), global[client.storage_date_format] == client.date_ddmmyy)}
                            {make_setting_row(client.text_settings_date_mmddyy, () => use_date(client.date_mmddyy), global[client.storage_date_format] == client.date_mmddyy)}
                            {make_setting_row(client.text_settings_date_yymmdd, () => use_date(client.date_yymmdd), global[client.storage_date_format] == client.date_yymmdd)}
                        </View>
                        {make_bottom_content()}
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
        marginTop: client.style_margin_top_content,
        marginBottom: client.style_margin_top_content
    },
    setting_section: {
        marginBottom: client.style_margin_section
    },
    setting_header: {
        fontSize: client.style_font_size_2,
        fontWeight: "bold"
    },
    account_button: {
        width: "100%",
        borderRadius: client.style_border_radius,
        justifyContent: "center",
        padding: client.style_padding_0,
        marginBottom: client.style_margin_top_quest
    },
    account_button_text: {
        fontSize: client.style_font_size_3,
        fontWeight: "bold",
        textAlign: "center"
    },
    info_text: {
        width: "100%",
        fontSize: client.style_font_size_3,
        textAlign: "center",
        marginBottom: client.style_margin_top_quest
    },
    setting_row: {
        marginTop: client.style_margin_top_quest,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center"
    },
    setting_text: {
        flex: 1,
        fontSize: client.style_font_size_3,
    },
    setting_circle: {
        width: client.style_image_setting_circle,
        height: client.style_image_setting_circle,
    },
    delete_modal: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center"
    },
    delete_view: {
        flexDirection: "column",
        width: "60%",
        borderRadius: client.style_border_radius
    },
    delete_title: {
        fontWeight: "bold",
        fontSize: client.style_font_size_2,
        textAlign: "center",
        width: "100%",
        padding: client.style_margin_top_content,
    },
    delete_text: {
        fontSize: client.style_font_size_3,
        textAlign: "center",
        padding: client.style_margin_top_quest,
        fontWeight: "bold",
        borderTopWidth: 0.2,
        padding: client.style_padding_0
    }
});