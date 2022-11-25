import ms from "ms";
import express from "express";
import cors from "cors"
import { parseMenu, pollMenu } from "./scrape"
import { WeekMenu } from "./types";

/* Utils */
import { getCurrentDayIndex } from "./utils";

/* Database */
import { Database } from "./database/db";
import { DatabaseHandler } from "./database/dbHandler";

export let currentMenu: WeekMenu;
let foodArchive: Database;

function setupPoller() {
    pollMenu().then(({currentPage, lastModified}) => {
        const timeUntilNextPoll = (16 * 60 * 1000) - (new Date().getTime() - lastModified.getTime());
        
        console.log("Page will be polled in " + ms(timeUntilNextPoll, { long: true }));

        const menu = parseMenu(currentPage);

        if (!menu) return;

        /* Add current menu to mongoDb */
        foodArchive.menu = menu[getCurrentDayIndex()];
        foodArchive.saveToDb(foodArchive.menu);
        foodArchive.readFromDb();
        
        currentMenu = menu;
        
        setTimeout(setupPoller,  timeUntilNextPoll);
    });
}

const app = express();

app.use(cors())

app.get("/api/v1/safka/", (req, res) => {
    res.json(currentMenu);
});

app.listen(5000);

/* Ininitialise database*/
const mongodb = new DatabaseHandler("SafkaBot2", "mongodb://127.0.0.1:27017")
mongodb.newClient();
mongodb.getDatabase().then((db => {
    foodArchive = new Database(db);
}))

/* Launch poller */
setupPoller();