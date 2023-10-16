import React from 'react';
import { GlobalProvider} from './components/GlobalProvider';
import AppGlobal from './pages/AppGlobal';

export default function App() {
    return (
        <GlobalProvider>
            <AppGlobal/>
        </GlobalProvider>
    )    
}

/**
LICENSES

vaadin:diploma-scroll (named as Logo.png)
Image by Astrit under Apache 2.0 License

devicon:google (named as Google.png)
Image by konpa under MIT License

material-symbols:notifications (named as Notifications.png)
Image by Google under Apache 2.0 License

gg:profile (named as Profile.png) 
Image by Astrit under MIT License

mdi:location (named as logo.png)
Image by Pictogrammers under Apache 2.0 License

mdi:location (named as Friends.png)
Image by Pictogrammers under Apache 2.0 License

mdi:gear (named as Settings.png)
Image by Pictogrammers under Apache 2.0 License

material-symbols:trophy (named as Leaderboard.png)
Image by Google under Apache 2.0 License
*/