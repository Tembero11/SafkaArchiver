import express from "express";
import cors from "cors"
import { WeekMenu } from "./types";
import Poller from "./poller";

export let currentMenu: WeekMenu;

const poller = new Poller();
poller.startPolling();
poller.on("polled", (menu) => {
    
});

const app = express();

app.use(cors())

app.get("/api/v1/safka/", (req, res) => {
    console.log(currentMenu)
    res.json(currentMenu);
});

app.listen(5000);