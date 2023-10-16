import { Linking, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { GlobalContext } from "./GlobalProvider";
import { client } from "../globalConstants";
import React from "react";
import { theme_colors } from "./ThemeColors";

export const ModalContext = React.createContext();

const MyModal = (visibility,colors) => {
    const redirect_to_store = () => {
        try {
            if (Platform.OS == "ios") {
                Linking.openURL(client.url_ios_store)
            }
            else {
                Linking.openURL(client.url_android_store);
            }
        } catch (err) {}
    }

    return (
        <Modal transparent={true} animationType="fade" visible={visibility} statusBarTranslucent={true}>
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
                        {client.text_update_title}
                    </Text>
                    <TouchableOpacity style={{width: "100%"}} onPress={redirect_to_store}>
                        <Text style={{
                            ...styles.delete_text,
                            color: colors.cyan,
                            borderColor: colors.button_border
                        }}>
                            {client.text_update_text}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}


export default function ModalProvider({ children }) {
    const {global, update_global} = React.useContext(GlobalContext);
    const [colors, setColors] = React.useState(theme_colors(global[client.storage_theme]));
    const [show_modal, set_show_modal] = React.useState(false);

    return(
        <ModalContext.Provider value={{set_show_modal}}>
            {MyModal(show_modal,colors)}
            {children}
        </ModalContext.Provider>
    )
}

const styles = StyleSheet.create({
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
})