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

export let currentMenu: WeekMenu;
let foodArchive: Database;

/* Ininitialise database*/
const dbSetup = new DatabaseSetup("SafkaBot2", "mongodb://127.0.0.1:27017");

(async function(){
    await dbSetup.newClient();
    const db = dbSetup.getDatabase();

    assert(db, new Error("Database undefined"));

    foodArchive = new Database(db);

    const poller = new Poller({ enableLogs: true });
    poller.startPolling();
    poller.on("polled", (menu) => {
        currentMenu = menu;
        
        /* foodArchive menus */
        foodArchive.weekMenu = currentMenu;
        foodArchive.dayMenu = currentMenu.days[getCurrentDayIndex()];
        /* Add current menu to mongoDb */
        foodArchive.saveMenus();
    });
})()

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());

app.get("/api/v1/safka/", (req, res) => {
    if (typeof req.query?.date != "string") return;
    const date = parseDate(req.query.date);

    if (!date) return;

    console.log(date.toLocaleDateString());


    if (currentMenu) {
        res.json(currentMenu);
    }
});

enum QueryType {
    String = "string",
    Number = "number",
    Boolean = "boolean",
}
interface QuerySchema {
    [name: string]: QueryType
}

function parseQuery<A extends QuerySchema, B extends QuerySchema>(query: {[key: string]: any}, required: A, optional: B): (A & Partial<B>) {
    return {} as (A & Partial<B>)
}

app.listen(PORT);