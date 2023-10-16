import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { GlobalContext } from "../components/GlobalProvider";
import * as Linking from "expo-linking";
import { client, other_consts } from "../globalConstants";
import { theme_colors } from "../components/ThemeColors";
import * as Google from "expo-auth-session/providers/google";
import { android_client_id, ios_client_id } from "../id";
import * as AppleAuthentication from "expo-apple-authentication";
import { ModalContext } from '../components/ModalProvider';

export default function SignIn() {
    const {set_show_modal} = React.useContext(ModalContext);
    const {global, update_global} = React.useContext(GlobalContext);
    const colors = theme_colors(global[client.storage_theme]);
    const [error_message, set_error_message] = React.useState(null);
    const [allow_apple, set_allow_apple] = React.useState(false);

    React.useEffect( () => {
        const func = async () => {
            set_allow_apple(await AppleAuthentication.isAvailableAsync())
        }
        func();
    }, [])

    const [google_request, google_response, google_promptAsync] = Google.useAuthRequest({
        androidClientId: android_client_id,
        iosClientId: ios_client_id,
        expoClientId: "null",
        redirectUri: Linking.createURL()
    });

    const login_apple = async () => {
        try {
            const ios_data = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ]
            });

            const ios_content = {
                token: ios_data.identityToken,
                is_apple: true
            }
            
            const ios_request = client.make_post_request(ios_content);
            const ios_url = client.make_url(client.url_token_login);

            try {
                const ios_data = await global[client.storage_fetch_func](ios_url,ios_request);
                if (!ios_data || !ios_data.valid) {
                    set_error_message(client.text_request_error);
                }
            } catch (err) {
                if (!other_consts.use_aws_ip) console.log(`login error`,err);
            }
        } catch (err) {
            set_error_message(client.text_signin_login_error);
        }
    }

    const login_with_token = async () => {
        try {
            await google_promptAsync();
        } catch (err) {
            if (!other_consts.use_aws_ip) console.log(`login with token err`,err);
        }
    }

    const redirect_to_privacy = async () => {
        Linking.openURL(client.url_privacy);
    }

    React.useEffect( () => {
        const func = async () => {
            if (!google_response || google_response.type == "dismiss") return 
            const google_content = {
                token: google_response.authentication.accessToken,
                is_apple: false
            }
            
            const google_request = client.make_post_request(google_content);
            const google_url = client.make_url(client.url_token_login);

            try {
                const google_data = await global[client.storage_fetch_func](google_url,google_request);
                if (!google_data || !google_data.key) {
                    set_error_message(client.text_request_error);
                }
            } catch (err) {
                if (!other_consts.use_aws_ip) console.log(`login error`,err);
            }
        }
        func();
    }, [google_response]);

    React.useEffect( () => {
        set_show_modal(global[client.storage_show_modal]);
    }, [global[client.storage_show_modal]])

    const apple_buttons = 
        <>
            <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                style={{
                    width: "100%", 
                    height: "70%",
                    marginBottom: client.style_margin_top_quest
                }}
                buttonStyle={ colors.theme == client.theme_dark ?
                    AppleAuthentication.AppleAuthenticationButtonStyle.WHITE :
                    AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                }
                cornerRadius={20}
                onPress={login_apple}
            />
            <TouchableOpacity style={{
                ...styles.signIn, 
                height: "70%",
                backgroundColor: colors.theme == client.theme_dark ? "white" : "black"
            }} 
                onPress={login_with_token}
            >
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "90%",
                    padding: client.style_padding_1
                }}>
                    <Image source={require("../img/Google.png")} style={{
                        width: 25,
                        height: 25,
                        marginRight: 10
                    }}/>
                    <Text style={{
                        fontSize: 25,
                        fontWeight: "bold",
                        color: colors.theme == client.theme_dark ? "black" : "white",
                    }}>
                        {client.text_signin_google_signin}
                    </Text>
                </View>
            </TouchableOpacity>
        </>
    ;

    const android_buttons = 
        <TouchableOpacity style={{...styles.signIn, backgroundColor: colors.text}} 
            onPress={login_with_token}
        >
            <View style={styles.signInContent}>
                <Image source={require("../img/Google.png")} style={styles.google}/>
                <Text style={{...styles.signInText, color: colors.background}}>
                    {client.text_signin_google_signin}
                </Text>
            </View>
        </TouchableOpacity>
    ;

    return (
        <View style={{...styles.container, backgroundColor: colors.background}}>
            <View style={styles.content}>
                <Image source={require("../img/logo.png")} 
                    style={{...styles.logo, tintColor: colors.cyan}}
                />
                <Text style={{...styles.title, color: colors.text}}>
                    {client.text_signin_title}
                </Text>
                <View style={styles.bottom}>
                    <Text style={{...styles.error, color: colors.error}}>
                        {error_message}
                    </Text>
                    { allow_apple ? apple_buttons : android_buttons }
                    <TouchableOpacity onPress={redirect_to_privacy}>
                        <Text style={{...styles.info, color: colors.text}}>
                            {client.text_settings_app_support}
                        </Text>                        
                    </TouchableOpacity>
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
        width: client.style_content_width,
        height: "100%",
        alignItems: "center",
    },
    logo: {
        width: client.style_image_logo,
        height: client.style_image_logo,
        marginTop: client.style_margin_top_center
    },
    title: {
        fontSize: client.style_font_size_0,
        fontWeight: "bold",
    },
    bottom: {
        position: "absolute",
        bottom: "5%",
        width: "100%",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "flex-end"
    },
    error: {
        fontSize: client.style_font_size_2,
        fontWeight: "bold",
        marginBottom: client.style_margin_top_quest,
        textAlign: "center"
    },
    signIn: {
        borderRadius: client.style_border_radius,
        width: "100%",
        alignItems: "center",
        marginBottom: client.style_margin_top_quest,
        justifyContent: "center"
    },
    signInContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
        padding: client.style_padding_2
    },
    google: {
        width: client.style_image_google,
        height: client.style_image_google,
        marginRight: "5%"
    },
    signInText: {
        fontSize: client.style_font_size_1,
        fontWeight: "bold",
    },
    info: {
        fontSize: client.style_font_size_3,
        textAlign: "center",
        textDecorationLine: "underline"
    }
})