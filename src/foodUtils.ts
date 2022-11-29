import { Diet, Food, Weekday, WeekMenu } from "./types";

export function getDayFromWeek(week: WeekMenu, day: Weekday | number) {
    return week.days[typeof day == "number" ? day : Object.values(Weekday).indexOf(day)];
}

export function isLactoseFree(food: Food) {
    return food.diets.includes(Diet.L);
}
export function isDairyFree(food: Food) {
    return food.diets.includes(Diet.M);
}
export function isGlutenFree(food: Food) {
    return food.diets.includes(Diet.G);
}