import React from "react";
import { StyleSheet, View, Text, Platform, Image, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { GlobalContext } from '../components/GlobalProvider';
import { client } from "../globalConstants";
import { theme_colors } from "../components/ThemeColors";

export default function NoLocation() {
    const {global, update_global} = React.useContext(GlobalContext);
    const colors = theme_colors(global[client.storage_theme]);

    const getLocation = async () => {
        try {
            const info = await Location.requestForegroundPermissionsAsync();
            if (info.status == "granted") {
                global[client.storage_update_location]();
            }
        } catch (err) {}
    }

    return (
        <View style={{...styles.container, backgroundColor: colors.background}}>
            <View style={{...styles.content}}>
                <Image source={require("../img/Quests.png")} style={{...styles.img, tintColor: colors.cyan}}/>
                <Text style={{...styles.title, color: colors.text}}>
                    {client.text_nolocation_title}
                </Text>
                <Text style={{...styles.description, color: colors.text}}>
                    {client.text_nolocation_subtitle}
                </Text>
                <TouchableOpacity style={{...styles.button, backgroundColor: colors.cyan}} onPress={getLocation}>
                    <Text style={{...styles.buttonText, color: colors.text}}>
                        {client.text_nolocation_enable}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        alignItems: "center",
    },
    content: {
        width: client.style_content_width,
        height: "100%",
        alignItems: "center",
    },
    img: {
        width: client.style_image_logo,
        height: client.style_image_logo,
        tintColor: client.dark_cyan,
        marginTop: client.style_margin_top_center
    },
    title: {
        fontSize: client.style_font_size_1,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: client.style_margin_top_quest
    },
    description: {
        fontSize: client.style_font_size_2,
        textAlign: "center",
        marginTop: client.style_margin_top_quest,
    },
    button: {
        borderRadius: client.style_border_radius,
        position: "absolute",
        bottom: "5%",
        width: "100%",
        padding: client.style_padding_0
    },
    buttonText: {
        fontSize: client.style_font_size_2,
        textAlign: "center",
        fontWeight: "bold"
    }
})
  