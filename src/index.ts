import express from "express";
import cors from "cors";
import util from "util";
import { WeekMenu } from "./types";
import Poller from "./poller";

export let currentMenu: WeekMenu | undefined;

const poller = new Poller({ enableLogs: true });
poller.startPolling();
poller.on("polled", (menu) => {
    currentMenu = menu;
    console.log(util.inspect(currentMenu, false, 4, true));
});

// HTTP

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.get("/api/v1/safka/", (req, res) => {
    if (currentMenu) {
        res.json(currentMenu);
    }
});

app.listen(PORT);