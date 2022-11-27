import { WeekMenu } from "./types";
import Poller from "./poller";
import dotenv from "dotenv";
import { getCurrentDayIndex } from "./utils";
import { Database } from "./database/db";
import { DatabaseSetup } from "./database/dbSetup";
import assert from "assert";
import { startServer } from "./api/startServer";


// Env
dotenv.config();

const { DISABLE_POLL } = process.env;
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017";
export const PORT = process.env.PORT || 5000;


export let currentMenu: WeekMenu;
let foodArchive: Database;

// Ininitialise database
const dbSetup = new DatabaseSetup("SafkaBot2", DB_URL);


// Async setup code
(async function(){
    await dbSetup.newClient();
    const db = dbSetup.getDatabase();

    assert(db, new Error("Database undefined"));

    foodArchive = new Database(db);

    if (!DISABLE_POLL) {
        const poller = new Poller({ enableLogs: true });
        poller.on("polled", (menu) => {
            currentMenu = menu;
            
            // foodArchive menus
            foodArchive.weekMenu = currentMenu;
            foodArchive.dayMenu = currentMenu.days[getCurrentDayIndex()];
            // Add current menu to MongoDb
            foodArchive.saveMenus();
        });
        poller.startPolling();
    }

    // Start the http api server
    startServer(Number(PORT));
})()