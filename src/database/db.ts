import { DayMenu, WeekMenu } from "../types";
import { Db } from 'mongodb';

interface Query {
    foodName?: string,
    weekNumber?: number,
    date?: Date
}

export class Database {
    weekMenu?: WeekMenu;
    dayMenu?: DayMenu;
    dbObj: Db;

    constructor(dbObj: Db) {
        this.dbObj = dbObj
    }

    async saveMenus() {
        const collection = this.dbObj.collection("foods");
        const menus = { weekMenu: this.weekMenu, dayMenu: this.dayMenu }

        await collection.insertOne(menus);
        this.retrieveEntry({foodName: "Riisip", weekNumber: this.weekMenu?.weekNumber})
    }

    async retrieveEntry({ foodName, weekNumber, date }: Query ) {
        if (foodName) console.log(foodName)
        if (weekNumber) console.log(weekNumber)
        if (date) console.log(date)
    }
}