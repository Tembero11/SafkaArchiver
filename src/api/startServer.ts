import cors from "cors";
import express from "express";
import { currentMenu } from "..";
import { parseDate } from "../utils";

export const app = express();

app.use(cors());
app.disable("x-powered-by");

app.get("/api/v1/safka/", (req, res) => {
    if (typeof req.query?.date != "string") return;

    const date = parseDate(req.query.date);

    if (!date) return;

    console.log(date.toLocaleDateString());

    if (currentMenu) {
        res.json(currentMenu);
    }
});

export function startServer(port: number) {
  app.listen(port); 
}