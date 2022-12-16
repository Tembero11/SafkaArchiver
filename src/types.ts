export type DayName = "maanantai" | "tiistai" | "keksiviikko" | "torstai" | "perjantai" | "lauantai" | "sunnuntai";

export enum Diet {
    L = "L",
    M = "M",
    G = "G",
}

export interface Food {
    name: string;
    diets: Diet[];
}

export interface DayMenu {
    dayId: Weekday;
    date: Date;
    menu: Food[];
}

export enum Weekday {
    Monday = "mon",
    Tuesday = "tues",
    Wednesday = "wed",
    Thursday = "thurs",
    Friday = "fri",
    Saturday = "sat",
    Sunday = "sun"
}

export interface WeekMenu {
    mtime: Date;
    weekNumber: number;
    days: DayMenu[];
}