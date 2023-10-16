import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import { client } from "./globalConstants.js";
import FetchManager from "./modules/fetchManager.js";
import DbManager from "./modules/dbManager.js";

/**
 * Initiates an Express server and all the managers associated with 
 * the Quest App. IP address and port are specified in GlobalConstants.js
 */

const clear_tables = true;

const setup = async () => {
    // enable environment variables
    dotenv.config();

    // EXPRESS SERVER
    const app = express();
    app.use(cors());
    app.use(express.json())

    // Managers
    new FetchManager(app);
    DbManager.make_database_connection_live();
    if (clear_tables) await DbManager.make_empty_tables();
    
    app.listen(client.express_port_number);
}

setup();
