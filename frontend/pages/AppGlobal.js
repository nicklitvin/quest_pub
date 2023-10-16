import { NavigationContainer } from "@react-navigation/native";
import NoLocation from "./PageNoLocation";
import SignIn from "./PageSignIn";
import LoggedIn from "./LoggedIn";
import React from "react";
import { GlobalContext } from '../components/GlobalProvider';
import * as Linking from "expo-linking";
import { client } from "../globalConstants";
import { StatusBar } from "expo-status-bar";
import { theme_colors } from "../components/ThemeColors";
import * as NavigationBar from "expo-navigation-bar";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import TutorialSlide from "./TutorialSlide";
import ModalProvider from "../components/ModalProvider";

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();
const prefix = Linking.createURL("/");

export default function AppGlobal() {
    const {global, update_global} = React.useContext(GlobalContext);
    const colors = theme_colors(global[client.storage_theme]);
    const [loading, set_loading] = React.useState(true);
    
    React.useEffect( () => {
        const func = async () => {
            await auto_login();

            setTimeout( () => {
                SplashScreen.hideAsync();
                set_loading(false);
            }, 250)
        }
        func();
    }, [])

    React.useEffect( () => {
        if (loading || !colors) return
        set_status_bar_color(colors.background);
    }, [
        colors.background, 
        loading
    ])

    const linking = {
        prefixes: [prefix],
        config: {
            screens: {
                [client.page_signin]: client.page_signin,
            }
        },
        fallback: {
            screens: {
                [client.page_signin]: client.page_signin
            }
        }
    }

    const auto_login = async () => {
        await global[client.storage_update_location]();

        try {
            if (global[client.storage_loggedIn] == client.true) return

            const my_key = await AsyncStorage.getItem(client.storage_key);
            const content = {
                key: my_key
            }

            const request = client.make_post_request(content);
            const url = client.make_url(client.url_key_login);
            const data = await global[client.storage_fetch_func](url,request);

            if (my_key != null && data == null) {
                update_global(client.storage_loggedIn, true);
            }

        } catch (err) {
            if (!other_consts.use_aws_ip) console.log(`key login err`,err);
        }
    }

    const set_status_bar_color = (color) => {
        if (Platform.OS == "android") {
            NavigationBar.setBackgroundColorAsync(color);
        }
    }

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <SafeAreaProvider>
                <SafeAreaView style={{flex: 1}}>
                    <ModalProvider>
                        <NavigationContainer linking={linking}>
                            {
                                Platform.OS == "android" ?
                                <StatusBar 
                                    style = {loading || colors.theme == client.theme_dark ? "light" : "dark"}
                                    backgroundColor= {loading || colors.theme == client.theme_dark ? 
                                        client.dark_background : colors.background
                                    }
                                /> : 
                                <StatusBar/>
                            }
                            <Stack.Navigator>
                                {
                                    global[client.storage_first_login] == client.true ? 
                                    <Stack.Screen name={client.page_tutorial} component={TutorialSlide} options={{headerShown: false}}></Stack.Screen> :
                                    (
                                        (global[client.storage_latitude] == null || global[client.storage_longitude] == null) ? 
                                        <Stack.Screen name={client.page_nolocation} component={NoLocation} options={{headerShown: false}}/> : 
                                        (
                                            global[client.storage_loggedIn] == client.false ?
                                            <Stack.Screen name={client.page_signin} component={SignIn} options={{headerShown:false}}/> :
                                            <Stack.Screen name={client.page_loggedin_navigator} component={LoggedIn} options={{headerShown:false}}/> 
                                        )
                                    )
                                }
                            </Stack.Navigator>
                        </NavigationContainer>
                    </ModalProvider>
                </SafeAreaView>
            </SafeAreaProvider>
        </View>
    )
}