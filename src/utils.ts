export function getCurrentDayIndex() {
    return [6, 0, 1, 2, 3, 4, 5][new Date().getDay()];
}

export function jsonPrettyPrinter(jsonObj: object) {
    return JSON.stringify(jsonObj, null, 4);
}

export function isProduction() {
    return process.env.NODE_ENV == "production";
}