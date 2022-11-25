import express from "express";
import cors from "cors";
import util from "util";
import { WeekMenu } from "./types";
import Poller from "./poller";


/* Utils */
import { getCurrentDayIndex } from "./utils";

/* Database */
import { Database } from "./database/db";
import { DatabaseHandler } from "./database/dbHandler";

export let currentMenu: WeekMenu;
let foodArchive: Database;

/* Ininitialise database*/
const mongodb = new DatabaseHandler("SafkaBot2", "mongodb://127.0.0.1:27017")
mongodb.newClient();
mongodb.getDatabase().then((db => {
    foodArchive = new Database(db);
}))

const poller = new Poller({ enableLogs: true });
poller.startPolling();
poller.on("polled", (menu) => {
    foodArchive.menu = menu.days[getCurrentDayIndex()];
    /* Add current menu to mongoDb */
    foodArchive.saveToDb(foodArchive.menu);
    foodArchive.readFromDb();

    currentMenu = menu;
    console.log(util.inspect(currentMenu, false, 4, true));
});

const PORT = process.env.PORT || 5000;
        
const app = express();

app.use(cors());

app.get("/api/v1/safka/", (req, res) => {
    if (currentMenu) {
        res.json(currentMenu);
    }
});

app.listen(PORT);