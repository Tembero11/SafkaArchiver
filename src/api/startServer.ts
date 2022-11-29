import cors from "cors";
import express from "express";
import { getDayFromWeek } from "../foodUtils";
import { currentMenu } from "../index";
import { getCurrentDayIndex } from "../utils";

export const app = express();

app.use(cors());
app.disable("x-powered-by");

app.get("/api/v1/menu/now", (req, res) => {
  const format = req.query.format == "true";

  const result = format ? JSON.stringify(currentMenu, null, 2) : JSON.stringify(currentMenu);

  res.status(200).type("application/json").end(result);
});

app.get("/api/v1/menu/today", (req, res) => {
  const format = req.query.format == "true";

  const today = getDayFromWeek(currentMenu, getCurrentDayIndex());

  const result = format ? JSON.stringify(today, null, 2) : JSON.stringify(today);

  res.status(200).type("application/json").end(result);
});

export function startServer(port: number) {
  app.listen(port); 
}