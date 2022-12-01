import { WeekMenu } from "./types";
import MenuPoller from "./webScrape/MenuPoller";
import dotenv from "dotenv";
import { getCurrentDayIndex } from "./utils";
import { Database } from "./database/db";
import assert from "assert";
import { startServer } from "./api/startServer";

// Env
dotenv.config();

const { DISABLE_POLL } = process.env || false;
const { DISABLE_DB } = process.env || false;
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017";
const DB_NAME = process.env.DB_NAME || "SafkaArchieverDB";
export const PORT = process.env.PORT || 5000;


export let currentMenu: WeekMenu;

// Async setup code
(async function(){
    const db = new Database({dbUrl: DB_URL, dbName: DB_NAME});

    assert(db, new Error("Database undefined"));

    if (!DISABLE_POLL) {
        const poller = new MenuPoller({ enableLogs: true });
        poller.once("polled", (menu) => {
            currentMenu = menu;

            if (!DISABLE_DB) {
                db.on("connected", (archiver) => {
                    // foodArchive menus                                                   
                    archiver.weekMenu = currentMenu;
                    archiver.dayMenu = currentMenu.days[getCurrentDayIndex()];
                    // Add current menu to MongoDb                                         
                    archiver.saveMenus();
                })
            }
            db.newClient();

            poller.on("polled", (menu) => {
                currentMenu = menu
            })
            
        });
        poller.startPolling();
    }
    
    // Start the http api server
    startServer(Number(PORT));
})()