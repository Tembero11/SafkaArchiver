import express from "express";
import cors from "cors";
import { WeekMenu } from "./types";
import Poller from "./poller";


/* Utils */
import { getCurrentDayIndex, parseDate } from "./utils";

/* Database */
import { Database } from "./database/db";
import { DatabaseSetup } from "./database/dbSetup";
import assert from "assert";
import { parseQuery, QueryType } from "./api/utils";

export let currentMenu: WeekMenu;
// let foodArchive: Database;

// /* Ininitialise database*/
// const dbSetup = new DatabaseSetup("SafkaBot2", "mongodb://127.0.0.1:27017");

// (async function(){
//     await dbSetup.newClient();
//     const db = dbSetup.getDatabase();

//     assert(db, new Error("Database undefined"));

//     foodArchive = new Database(db);

//     const poller = new Poller({ enableLogs: true });
//     poller.startPolling();
//     poller.on("polled", (menu) => {
//         currentMenu = menu;
        
//         /* foodArchive menus */
//         foodArchive.weekMenu = currentMenu;
//         foodArchive.dayMenu = currentMenu.days[getCurrentDayIndex()];
//         /* Add current menu to mongoDb */
//         foodArchive.saveMenus();
//     });
// })()
console.log("hello")

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());

app.get("/api/v1/safka/", (req, res) => {

    const query = parseQuery(req.query, {test: QueryType.Integer}, {});
    query.test
    console.log("run")


    res.send("hello")
});

app.listen(PORT);