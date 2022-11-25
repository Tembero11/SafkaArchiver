import { copyFileSync } from "fs";
import { Db, MongoClient } from "mongodb";

export class DatabaseSetup {
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

            console.log(`Connected successfully to server with database ${this.dbName}`);

            // Create a database object used to modify or read the database
            this._db = client.db(this.dbName);
            this._client = client;

        } catch (err) {
            console.log(`Error happened. Shutting down. Logs: ${err}`);
            process.exit(1);
        }
    }

    closeClient() {
        if (this._client !== undefined) this._client.close();
    }

    getClient() {
        return this._client;
    }

    getDatabase() {
        return this._db;
    }
}