import { DayMenu, WeekMenu } from "../types";
import fs from "fs";
import path from "path";
import { jsonPrettyPrinter } from "../utils";
import { DatabaseHandler } from "./dbHandler";
import { MongoClient, Db } from 'mongodb';
import util from "util";

export class Database {
    menu?: DayMenu;
    dbObj?: Db;

    constructor(dbObj?: Db, menu?: DayMenu) {
        this.menu = menu
        this.dbObj = dbObj
    }

    async saveToDb(menuObj: DayMenu) {
        if (this.dbObj != undefined) {
            const collection = this.dbObj.collection("foods");
            const res = await collection.insertOne(menuObj);
        }
    }

    async readFromDb() {
        if (this.dbObj != undefined) console.log(util.inspect(await this.dbObj.collection("foods").find({}).toArray(), false, 5, true));
    }
}