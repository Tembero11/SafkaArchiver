import { Db, MongoClient} from "mongodb";

export class Mongo {
    dbName: string;
    dbUrl: string;
    _db?: Db = undefined;
    _client?: MongoClient = undefined;

    constructor(dbName: string, dbUrl: string) {
        this.dbName = dbName;
        this.dbUrl = dbUrl;
    }

    async newClient() {
        // Creating a client
        const client = new MongoClient(this.dbUrl);

        // Use connect method to connect to the server
        console.log(`Connected successfully to server with database ${this.dbName}`);

        // Create a database object used to modify or read the database
        this._db = client.db(this.dbName);
        this._client = client;
    }

    async getClient() {
        return this._client;
    }

    async getDatabase() {
        return this._db;
    }
}