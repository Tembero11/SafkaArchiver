import { DayMenu, WeekMenu } from "../types";
import fs from "fs";
import path from "path";
import { jsonPrettyPrinter } from "../utils";
import { DatabaseSetup } from "./dbSetup";
import { MongoClient, Db } from 'mongodb';
import util from "util";

export class Database {
    menu?: DayMenu;
    dbObj: Db;

    constructor(dbObj: Db, menu?: DayMenu) {
        this.menu = menu
        this.dbObj = dbObj
    }

    async saveEntry(menuObj: DayMenu) {
        if (this.dbObj != undefined) {
            const collection = this.dbObj.collection("foods");
            const res = await collection.insertOne(menuObj);
            console.log("JUTTUJA::::" + res);
        }
    }

    async retrieveEntry(keyword: string) {
        console.log(keyword)
    }

   async readFromDb() {
        if (this.dbObj != undefined) console.log(util.inspect(await this.dbObj.collection("foods").find({}).toArray(), false, 5, true));
    }
}