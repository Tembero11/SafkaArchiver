import { copyFileSync } from "fs";
import { Db, MongoClient } from "mongodb";

export class DatabaseHandler {
    dbName: string;
    dbUrl: string;
    _db?: Db = undefined;
    _client?: MongoClient = undefined;

    constructor(dbName: string, dbUrl: string) {
        this.dbName = dbName;
        this.dbUrl = dbUrl;
    }

    async newClient() {
        try {
            // Creating a client
            const client = await MongoClient.connect(this.dbUrl);

            // Use connect method to connect to the server
            console.log(`Connected successfully to server with database ${this.dbName}`);

            // Create a database object used to modify or read the database
            this._db = client.db(this.dbName);
            this._client = client;

        } catch (err) {
            console.log(err)
        }
    }

    async getClient() {
        return this._client;
    }

    async getDatabase() {
        return this._db;
    }
}