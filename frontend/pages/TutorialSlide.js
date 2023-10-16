import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { client } from '../globalConstants';
import * as Pages from '../components/Tutorial';
const Tab = createMaterialTopTabNavigator();

export default function TutorialSlide() {

    return (
        <Tab.Navigator
            tabBarPosition="bottom"
            screenOptions = {() => ({
                tabBarStyle: {display: "none"}
            })}
            initialRouteName={client.tutorial_page_welcome}
        >
            <Tab.Screen name={client.tutorial_page_welcome} component={Pages.Welcome} />
            <Tab.Screen name={client.tutorial_page_types} component={Pages.Types}/>
            <Tab.Screen name={client.tutorial_page_sights} component={Pages.Sights}/>
            <Tab.Screen name={client.tutorial_page_events} component={Pages.Events}/>
            <Tab.Screen name={client.tutorial_page_path} component={Pages.Path}/>
            <Tab.Screen name={client.tutorial_page_profile} component={Pages.Profle}/>
            <Tab.Screen name={client.tutorial_page_reload} component={Pages.Reload}/>
            <Tab.Screen name={client.tutorial_page_settings} component={Pages.Settings}/>
            <Tab.Screen name={client.tutorial_page_heart} component={Pages.Heart}/>
        </Tab.Navigator>
    )
}
