import interpreter from "./clientInterpter.js";
import { client, use_aws_ip, data_types } from "../globalConstants.js";
import fs from "fs";

/**
 * Fetch Manager is responsible for receiving http requests from users
 * and returning the new state of the environment from the user's 
 * perspective. Class takes in Express server as argument for initialization.
 */
export default class FetchManager {
    constructor(app) {

        app.post(client.url_get_all, (req,res) => {
            const func = async () => {
                try {
                    const data = req.body; 
                    if (!use_aws_ip) console.log("received get_all",data);
                    res.send(
                        await interpreter.get_all(
                            data.key, data.latitude, data.longitude, data.version
                        )
                    );
                } catch {
                    const response = {...data_types.response_all}
                    res.send(response);
                }
            }
            func();
        })

        app.post(client.url_token_login , (req,res) => {
            const func = async () => {
                try {
                    const data = req.body; 
                    if (!use_aws_ip) console.log("received token_login",data);
                    res.send(await interpreter.login_with_token(
                        data.token,null,data.is_apple, data.version
                    ));
                } catch {
                    const response = {...data_types.response_login}
                    res.send(response);
                }
            }
            func();
        })

        app.post(client.url_key_login, (req,res) => {
            const func = async () => {
                try {
                    const data = req.body; 
                    if (!use_aws_ip) console.log("received key_login",data);
                    res.send(await interpreter.login_with_key(data.key, data.version));
                } catch {
                    const response = {...data_types.response_login}
                    res.send(response);
                }
            }
            func();
        })

        app.post(client.url_get_locations, (req,res) => {
            const func = async () => {
                try {
                    const data = req.body;
                    if (!use_aws_ip) console.log("received get_locations",data);
                    res.send(
                        await interpreter.get_locations(
                            data.key,data.latitude,data.longitude, data.version
                        )
                    );
                } catch {
                    const response = {...data_types.response_place_list};
                    res.send(response);
                }
            }
            func();
        })

        app.post(client.url_get_events, (req,res) => {
            const func = async () => {
                try {
                    const data = req.body;
                    if (!use_aws_ip) console.log("received get_events",data);
                    res.send(
                        await interpreter.get_events(
                            data.key,data.latitude,data.longitude, data.version
                        )
                    );
                } catch {
                    const response = {...data_types.response_place_list};
                    res.send(response);
                }
            }
            func();
        })

        app.post(client.url_claim_location, (req,res) => {
            const func = async () => {
                try {
                    const data = req.body;
                    if (!use_aws_ip) console.log("received claim location",data);
                    res.send(
                        await interpreter.claim_location(
                            data.key,data.place_id,data.latitude,data.longitude, data.version
                        )
                    );
                } catch {
                    const response = {...data_types.response_claim};
                    res.send(response);
                }
            }
            func();
        })

        app.post(client.url_claim_event, (req,res) => {
            const func = async () => {
                try {
                    const data = req.body;
                    if (!use_aws_ip) console.log("received claim event",data);
                    res.send(
                        await interpreter.claim_event(
                            data.key,data.event_id,data.latitude,data.longitude, data.version
                        )
                    );
                } catch {
                    const response = {...data_types.response_claim};
                    res.send(response);
                }
            }
            func();
        })

        app.post(client.url_get_user_activity, (req,res) => {
            const func = async () => {
                try {
                    const data = req.body;
                    if (!use_aws_ip) console.log("received get_user_activity",data);
                    res.send(
                        await interpreter.get_user_activity(
                            data.key, data.latitude, data.longitude, data.version
                        )
                    );
                } catch {
                    const response = {...data_types.response_place_list};
                    res.send(response);
                }
            }
            func();
        })

        app.post(client.url_delete_account, (req,res) => {
            const func = async () => {
                try {
                    const data = req.body;
                    if (!use_aws_ip) console.log("received delete_account",data);
                    res.send(
                        await interpreter.delete_account(data.key, data.version)
                    );
                } catch {
                    const response = {...data_types.response_delete};
                    res.send(response);
                }
            }
            func();
        })

        app.get("/", (req,res) => {
            const func = async () => {
                fs.readFile("./modules/privacy.html","utf-8", (err,data) => res.send(data))
            }
            func();
        })
    }
}