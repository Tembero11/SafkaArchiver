import cors from "cors";
import express, { Router } from "express";
import { getDayFromWeek } from "../foodUtils";
import { currentMenu } from "../index";
import { getCurrentDayIndex } from "../utils";

export const app = express();

app.disable("x-powered-by");

const api = Router();
api.use(cors());

api.get("/v1/menu", (req, res) => {
  const format = req.query.format == "true";

  const result = format ? JSON.stringify(currentMenu, null, 2) : JSON.stringify(currentMenu);

  res.status(200).type("application/json").end(result);
});

api.get("/v1/menu/today", (req, res) => {
  const format = req.query.format == "true";

  const today = getDayFromWeek(currentMenu, getCurrentDayIndex());

  const result = format ? JSON.stringify(today, null, 2) : JSON.stringify(today);

  res.status(200).type("application/json").end(result);
});

interface StartServerOptions {
  apiBaseRoute?: string
}

export function startServer(port: number, options?: StartServerOptions) {
  app.use(options?.apiBaseRoute || "/api", api);
  app.listen(port); 
}