import { client } from "../globalConstants"

export function theme_colors(theme) {
    return {
        theme: theme,
        background : theme == client.theme_dark ? client.dark_background : client.light_background,
        text: theme == client.theme_dark ? client.dark_text : client.light_text,
        cyan: theme == client.theme_dark ? client.dark_cyan : client.light_cyan,
        button: theme == client.theme_dark ? client.dark_button : client.light_button,
        button_border: theme == client.theme_dark ? client.dark_button_border : client.light_button_border,
        error: theme == client.theme_dark ? client.dark_error : client.light_error,

        opp_button_border: theme == client.theme_light ? client.dark_button_border : client.light_button_border,
    }
}
