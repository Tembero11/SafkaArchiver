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
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
}

export interface WeekMenu {
    mtime: Date;
    weekNumber: number;
    days: DayMenu[];
}

export interface Menus {
    weekMenu: WeekMenu
    dayMenu: DayMenu
}