import { Text, View } from "react-native";
import { client } from "../globalConstants";
import React from "react";

export default function Header(title,colors) {
    let subtitle;

    switch (title) {
        case (client.page_events): 
            subtitle = client.header_events;
            break;
        case (client.page_quests):
            subtitle = client.header_quests;
            break;
        case (client.page_profile):
            subtitle = client.header_profile;
            break;
        case (client.page_settings):
            subtitle = client.header_settings;
            break;
    }

    return (
        <View style={{
            alignItems: "center", 
            backgroundColor: colors.background,
            borderBottomColor: colors.text,
            borderBottomWidth: 1
        }}>
            <Text style={{
                fontSize: client.style_font_size_1,
                fontWeight: "bold",
                color: colors.text
            }}>
                {title}
            </Text>
                <Text style={{
                    fontSize: client.style_font_size_3,
                    color: colors.text,
                    paddingBottom: client.style_padding_1,
                    textAlign: "center",
                    width: client.style_content_width
                }}>
                    {subtitle}
                </Text>
        </View>
    )
}