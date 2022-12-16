import { WeekMenu } from "../types";
import { Db, MongoClient, ObjectId } from 'mongodb';
import { DatabaseMenu, DatabaseWeek } from "./dbTypes";
import { getCurrentDayIndex } from "../utils";

interface DatabaseOptions {
    dbUrl: string
    dbName: string
}

export class Database {
    dbUrl: string;
    dbName: string; 
    _client?: MongoClient = undefined;
    _db?: Db = undefined;

    constructor(options: DatabaseOptions) {
        this.dbUrl = options.dbUrl;
        this.dbName = options.dbName;
    }
    
    async connect() {
        // Don't do a new client if we already have a client
        if (this.client !== undefined) return

        console.log(`\nAttempting connection to "${this.dbUrl}"...\nProgram will exit if connection does not succeed\n`)
        try {
            // Creating a client
            const client = await MongoClient.connect(this.dbUrl);

            console.log(`Connected successfully to server with database "${this.dbName}"\n`);

            // Create a database object used to modify or read the database
            this._db = client.db(this.dbName);
            this._client = client;

            return new Archiver({dbUrl: this.dbUrl, dbName: this.dbName}, this.database as Db);
        } catch (err) {
            console.log(`Error happened. Shutting down. Logs: ${err}`);
            process.exit(1);
        }

    }

    get database() {
        if (this._db !== undefined)  return this._db;
    }

    get client() {
        return this._client;
    }
   
}

///////////////////////////////////////////////////////////

interface Query {
    foodName?: string
    weekNumber?: number
    date?: Date
}

export class Archiver extends Database {
    weekMenu?: WeekMenu;
    _db?: Db = undefined

    constructor(options: DatabaseOptions, db: Db) {
        super(options);
        this._db = db
        
    }

    // Converts a WeekMenu to be suited for saving to a database
    convertMenu(): DatabaseMenu | Error {
        if (this.weekMenu !== undefined) {
            const dayMenu = this.weekMenu.days[getCurrentDayIndex()];
            const weekData: DatabaseWeek = { weekNumber: this.weekMenu.weekNumber, year: new Date().getUTCFullYear() };
            return { 
                _id: new ObjectId(), version: 0, hash: dayMenu.hash, week: weekData, date: dayMenu.date, dayId: dayMenu.dayId, foods: dayMenu.menu 
            };
        }
        return new Error("Archiver is never given a weekMenu.");
    }

    async saveMenus() {
        if (this._db !== undefined) {
            const convertedMenu = this.convertMenu();
            if (convertedMenu instanceof Error) {
                console.error("Menu cannot be saved to database, no non-undefined menu was given to Archiver.");
                return
            }

            const collection = this._db.collection("foods");

            const hashExistsForMenu = await collection.findOne({ hash: convertedMenu.hash })

            if (hashExistsForMenu === null) {
                await collection.insertOne(convertedMenu);
            } else {
                console.log("Hash for foods already exists, not adding.")
            }
            
            this.retrieveEntry({foodName: "Riisip", weekNumber: this.weekMenu?.weekNumber})
        }
    }

    async retrieveEntry(query: Query ) {
        if (this._db !== undefined) {
            const xd: unknown = await this._db.collection("foods").findOne({"dayMenu.menu": {$elemMatch: {"name": "Lohimurekepihvit"}}})

            if (query.weekNumber) console.log(query.weekNumber)
            if (query.date) console.log(query.date)
        }
    }
}