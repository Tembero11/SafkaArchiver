import { DayMenu, WeekMenu } from "../types";
import fs from "fs";
import path from "path";
import { jsonPrettyPrinter } from "../utils";
import { Mongo } from "./mongo";
import { MongoClient, Db } from 'mongodb';

export class Database {
    menu?: DayMenu;
    dbObj?: Db;

    constructor(dbObj?: Db, menu?: DayMenu) {
        this.menu = menu
        this.dbObj = dbObj
    }

    /* async saveToJson() {
        if (this.menu?.menu != undefined) {
            const menuObj = this.menu?.menu;
            for (let i = 0; i < menuObj.length; i++) {
                try {
                    await fs.promises.writeFile(path.join(process.cwd(), "database.json"), jsonPrettyPrinter(menuObj));
                } catch (err) {
                    console.log(err);
                }
            }

            try {
                const data = await fs.promises.readFile(path.join(process.cwd(), "database.json"), "utf-8");
                console.log("Database.json read correctly!");
            } catch (err) {
                console.log(err);
            }
        }
    }
 */
    async saveToDb(menuObj: DayMenu) {
        if (this.dbObj != undefined) {
            const collection = this.dbObj.collection("foods");
            const res = await collection.insertOne(menuObj);
        }
    }

    async readFromDb() {
        if (this.dbObj != undefined) console.log(await this.dbObj.collection("foods").find({}).toArray());
    }
}