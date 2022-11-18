import { DayMenu, WeekMenu } from "../types";
import fs from "fs";
import path from "path";

export async function saveToJson(menuObj: DayMenu) {
    for (let i = 0; i < menuObj.menu.length; i++) {

        try {
            await fs.promises.writeFile(path.join(process.cwd(), "database.json"), JSON.stringify(menuObj));
        } catch (err) {
            console.log(err);
        }
    }

    try {
        const data = await fs.promises.readFile(path.join(process.cwd(), "database.json"), "utf-8");
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}
