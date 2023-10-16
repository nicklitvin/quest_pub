const local_ip = "192.168.86.30";
const local_port = 3000;
const aws_ip = "3.136.27.48";
const aws_port = 3001;

export const other_consts = {
    meter_to_mile: 0.000621371,
    meter_to_km: 0.001,
    app_version: "2.0.1",
    use_aws_ip: true
}

export const data_types = {
    activity: {
        title: "",
        latitude: "",
        longitude: "",
        distance: "",
        radius: null,
        id: null,

        start_time: null,
        end_time: null,
        web_link: null,
        event_id: null,
        is_happening: null,

        date: null,
    },
    response_login : {
        key: null
    },
    response_place_list: {
        key: null,
        places: []
    },
    response_claim: {
        key: null,
        valid: false
    },
    response_all: {
        key: null,
        locations: null,
        events: null,
        activity: null,
    },
    response_delete: {
        key: null,
        valid: false
    },
}

export const client = {
    true: "true",
    false: "false",
    null: "null",

    url_token_login: "/tokenLogin",
    url_key_login: "/keyLogin",
    url_claim_location: "/claimLocation",
    url_claim_event: "/claimEvent",
    url_delete_account: "/deleteAccount",
    url_get_locations: "/getLocations",
    url_get_events: "/getEvents",
    url_get_user_activity: "/getActivity",
    url_get_all: "/getAll",
    url_oauth_redirect: "com.nicklitvin.quest:/",
    url_privacy: `https://nicklitvin.github.io/quest_supp/`,
    url_ios_store: "https://apps.apple.com/us/app/quest-finder/id6461866470",
    url_android_store: "https://play.google.com/store/apps/details?id=com.nicklitvin.quest&hl=en_US&gl=US",
    url_form_sight: "https://docs.google.com/forms/d/e/1FAIpQLScf1lqdXuYUWATBc_NBKSsN6RBpJsqdP_Ank3ieKIZwKdSYDQ/viewform?usp=sf_link",
    url_form_event: "https://docs.google.com/forms/d/e/1FAIpQLSc595RQ5Zgvr50p1AHmweBTZON-vne9jlw61fELX0eTGmBZtQ/viewform?usp=sf_link",

    page_quests: "Sights",
    page_profile: "Activity",
    page_settings: "Settings",
    page_events: "Events",
    page_nolocation: "NoLocation",
    page_signin: "SignIn",
    page_loggedin_navigator: "LoggedIn",
    page_loading: "Loading",
    page_tutorial: "Tutorial",

    storage_key: "storage_key",
    storage_latitude: "latitude",
    storage_longitude: "longitude",
    storage_theme: "theme",
    storage_use_km: "use_km",
    storage_date_format: "date_format",
    storage_fetch_func: "fetch_func",
    storage_loggedIn: "storage_loggedIn",
    storage_update_location: "update_location",
    storage_first_login: "first_login",
    storage_show_modal: "show_modal",

    storage_response_login: "storage_login",
    storage_response_activity: "storage_activity",
    storage_response_claim: "storage_claim",
    storage_response_locations: "storage_locations",
    storage_response_events: "storage_events",

    dark_background: "#120F12",
    dark_text: "#D3D3D3",
    dark_cyan: "#168F80",
    dark_button: "#221D22",
    dark_button_border: "#3D3D3D",
    dark_error: "#8F1616",

    light_background: "#B1B1B1",
    light_text: "#161616",
    light_cyan: "#0F8072",
    light_button: "#9CAFAD",
    light_button_border: "#343434",
    light_error: "#CD1111",

    style_font_size_0: 36,
    style_font_size_1: 24,
    style_font_size_2: 18,
    style_font_size_3: 16,
    style_font_size_4: 12,

    style_margin_top_content: 25,
    style_margin_top_quest: 10,
    style_margin_section: 40,
    style_margin_top_center: "40%",

    style_content_width: "85%",

    style_border_radius: 25,
    style_border_radius_1: 10,

    style_padding_0: 15,
    style_padding_1: 10,
    style_padding_2: 25,

    style_image_logo: 125,
    style_image_row_profile: 36,
    style_image_row_profile_1: 24,
    style_image_bottom_buttons: 35,
    style_image_setting_circle: 20,
    style_image_google: 40,

    theme_dark: "dark",
    theme_light: "light",

    date_yymmdd: "yymmdd",
    date_mmddyy: "mmddyy",
    date_ddmmyy: "ddmmyy",

    text_signin_login_error: "Login Error",
    text_signin_google_signin: "Sign in with Google",
    text_signin_title: "Quest Finder",
    
    text_nolocation_title: "No Location",
    text_nolocation_subtitle: "Precise Location is required to use this app to get local quests and calculate accurate distances",
    text_nolocation_enable: "Enable Location",
    
    text_quests_noquests: "No quests in your area",
    text_quests_claimnow: "Claim Now",
    text_quests_suggest_title: "Are We Missing A Cool Sight In Your Area?",
    text_quests_suggest_subtitle: "Click to submit your suggestion",

    text_events_suggest_title: "Are We Missing A Fun Event In Your Area?",
    text_events_suggest_subtitle: "Click to submit your suggestion",
    text_events_filter_today: "Only Today",
    text_events_filter_week: "Only This Week",

    text_profile_only_events: "Only Events",
    text_profile_only_sights: "Only Sights",
    text_profile_search_placeholder: "Search",

    text_settings_distance_header: "Distance Units",
    text_settings_distance_km: "Kilometers (km)",
    text_settings_distance_mi: "Miles (mi)",
    text_settings_appearance_header: "Appearance",
    text_settings_appearance_light: "Light Theme",
    text_settings_appearance_dark: "Dark Theme",
    text_settings_date_header: "Date Format",
    text_settings_date_ddmmyy: "dd/mm/yyyy",
    text_settings_date_mmddyy: "mm/dd/yyyy",
    text_settings_date_yymmdd: "yyyy/mm/dd",
    text_settings_logout: "Log Out",
    text_settings_app_version: `Version ${other_consts.app_version}`,
    text_settings_app_support: "Terms of Service & More Info",
    text_settings_delete_button: "Delete Account",
    text_settings_delete_title: "Are you sure you want to delete your account?",
    text_settings_delete_confirm: "Confirm",
    text_settings_delete_cancel: "Cancel",
    text_settings_tutorial_text: "View Tutorial",
    
    text_request_error: "Request Error. Check your internet connection and if you installed the latest update.",
    
    text_update_title: "Quest Finder received a new update!",
    text_update_text: "Go to Store",

    header_quests: "Free to come to and can be claimed anytime",
    header_profile: "A record of all Quests that you have claimed",
    header_settings: "Customizable features & account management",
    header_events: "Time-sensitive activities of wide variety",

    tutorial_page_welcome: "Welcome",
    tutorial_welcome_title: "Welcome to Quest Finder",
    tutorial_welcome_subtitle: "Swipe left to begin the quick tutorial",

    tutorial_page_types: "Types",
    tutorial_types_title: "There are 2 types of Quests",
    tutorial_types_subtitle: "Events and Sights",

    tutorial_page_sights: "Sights",
    tutorial_sights_title: "Sights are free to come to and can be claimed anytime",
    tutorial_sights_subtitle: "Click on the Sight below to see it on a map",

    tutorial_page_events: "Events",
    tutorial_events_title: "Events can only be claimed in the specified time frame and may not be free",
    tutorial_events_subtitle: "Click on the Event below to see more info",

    tutorial_page_path: "Path",
    tutorial_path_title: "Come to the location and you will see Claim Now",
    tutorial_path_subtitle: "Don't forget to press it or it won't count!",

    tutorial_page_profile: "Profile",
    tutorial_profile_title: "You will find all of your claimed Quests in the Activity Tab",
    tutorial_profile_subtitle: "Clicking them will still redirect to a map",

    tutorial_page_reload: "Reload",
    tutorial_reload_title: "Pull down to refresh the page and get the most up to date info",
    tutorial_reload_subtitle: "It will also update the distances to nearby Quests",

    tutorial_page_settings: "Settings",
    tutorial_settings_title: "You can customize this App's appearance in Settings",
    tutorial_settings_subtitle: "There will also be a link to this tutorial in case you need it",

    tutorial_page_heart: "Heart",
    tutorial_heart_title: "That's it. Enjoy the App!",
    tutorial_heart_subtitle: "-Quest Finders Team",
    tutorial_heart_button: "Begin your Quest Journey",


    make_post_request: (content) => {
        content.version = other_consts.app_version
        return ({
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(content)
        })
    },

    make_url: (url_extension) => {
        return other_consts.use_aws_ip ? 
            `http://${aws_ip}:${aws_port}${url_extension}` : 
            `http://${local_ip}:${local_port}${url_extension}`
    },

    make_maps_request_url: (id) => {
        return `https://www.google.com/maps/search/?api=1&query=${id}&query_place_id=${id}`
    }
}