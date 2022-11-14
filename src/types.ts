export type DayName = "maanantai" | "tiistai" | "keksiviikko" | "torstai" | "perjantai" | "lauantai" | "sunnuntai";


export enum Diet {
    L = "L",
    M = "M",
    G = "G",
}

export interface DayMenu {
    day: DayName,
    menu: { name: string, diets: Diet[]}[]
}

export type WeekdayId = "mon" | "tues" | "wed" | "thurs" | "fri" | "sat" | "sun";

export type WeekMenu = Map<WeekdayId, {
    menu: { name: string; diets: Diet[]; }[];
}>