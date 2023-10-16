# Description 

This repository contains all of the code necessary to build Quest Finder, a mobile app for travel recommendation. 
The folders contain the following contents:
- frontend: React Native app to be built with Expo
- locations: Generation of sql files using Google Maps API
- server: NodeJS server and MYSQL database to handle requests

## Project Setup

aws nodejs setup: https://github.com/nodesource/distributions#debinstall

aws db setup and connect: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_RDS_Configuring.html

local db setup (MYSQL command line client): https://dev.mysql.com/doc/refman/8.0/en/windows-installation.html 

login into MYSQL client 
```
mysql -h <hostname> -P <port number> -u <user> -p
```

clone repo
```
git clone https://github.com/nicklitvin/quest_pub
```

install dependencies inside frontend AND backend folder
```
npm install
```

### Frontend

create /frontend/id.js
```
export const android_client_id = "<android client id from google cloud console>";
export const ios_client_id = "<ios client id from google cloud console>";
```

### Backend 
create /server/.env 
```
MYSQL_HOST = "<ip address of db or other link to it>"
MYSQL_USER = "<admin>"
MYSQL_PASSWORD = "<password>"
MYSQL_DATABASE = "<database name>"
```

add locations to database in MYSQL client
```
source ~/quest/server/locationInsertion/<sql filename>
```

## Running Frontend 

Frontend is built using Expo, install Expo Go on Android Emulator and/or Android Phone

To run app quickly (note that google oauth won't work unless you setup expoClientId)
```
npx expo start
```

Configure before building apk
```
eas build:configure
```

Build the apk file, (this may take a while). You need an expo.dev account
```
eas build --profile development --platform android
```

Download the apk and start development session
```
npx expo start --dev-client
```

Scan the QR code in the Expo GO app to view the frontend ot press a to view in Android Emulator

## Running Backend

Backend uses Express server and MYSQL for database.

Run all tests command
```
npm test
```

Run specific test module/test (note that \ must come before symbols such as +)
```
jest -t "<regex>"
```

To run setup sql file generated from /server/

## Location Generation

create Maps API key
```
api_key = "<api key received from Google Maps API>"
```

Generate json of locations
```
py ./locations/main.py
```

Move json file into /server/locationInsertion and generate SQL file
```
node ./server/locationInsertion/locationInsert.js
```

In MySQL command line, run to insert all the locations into the table
```
source <full path to sql file>
```

## Things to keep in mind

- Download all dependencies prior to building the apk file
- https://docs.expo.dev/develop/development-builds/create-a-build/?redirected
- there are 2 copies of globalConstants.js (frontend and backend that have some diff values), you cannot import the one that is not in the folder you are in
- to test deep linkage with Android Studio Emulator, run command after launching 
```
npx uri-scheme open exp://127.0.0.1:19000/--/<path> --android
```
- make sure frontend server and user are on the same wifi connection, and ip address + port match
- android sha1 key in expo.dev site under credentials

## Checklists

### Pushing to Github
- server must pass all tests
- update .gitignore to hide all API keys
    - frontend/google_console_api_key.json
    - frontend/id.js
    - server/.env

### Publishing to Play Store
- Update app version in in app.json AND frontend/globalConstants.js
- .gitignore, remove comment /frontend/id.js 
- /frontend/components/GlobalProvider.js, set all constants = FALSE
- /frontend/globalConstants.js, use_aws_ip = TRUE
- Update App release notes
```
eas build --platform android
eas build --platform ios

eas submit -p android
eas submit -p ios
```
