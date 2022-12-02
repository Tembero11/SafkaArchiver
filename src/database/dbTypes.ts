import { ObjectId } from "mongodb";
import { DayMenu } from "../types";

export interface DbDay extends DayMenu {
    _id?: ObjectId;
    version: number;
    hash: string;
    week: { num: number, year: number };
}