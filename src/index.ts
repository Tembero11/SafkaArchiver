import ms from "ms";
import express from "express";
import cors from "cors"
import { parseMenu, pollMenu } from "./scrape"
import { WeekMenu } from "./types";

/* Utils */
import { getCurrentDayIndex } from "./utils";

/* Data base */
import { saveToJson } from "./database/database";

export let currentMenu: WeekMenu;

function setupPoller() {
    pollMenu().then(({currentPage, lastModified}) => {
        const timeUntilNextPoll = (16 * 60 * 1000) - (new Date().getTime() - lastModified.getTime());
        
        console.log("Page will be polled in " + ms(timeUntilNextPoll, { long: true }));

        const menu = parseMenu(currentPage);

        if (!menu) return;
        saveToJson(menu[getCurrentDayIndex()]);
        
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


setupPoller();