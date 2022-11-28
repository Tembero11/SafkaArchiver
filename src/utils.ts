export function getCurrentDayIndex() {
    return [6, 0, 1, 2, 3, 4, 5][new Date().getDay()];
}

export function jsonPrettyPrinter(jsonObj: object) {
    return JSON.stringify(jsonObj, null, 4);
}

export function isProduction() {
    return process.env.NODE_ENV == "production";
}

export function parseDate(dateStr: string) {
    const [ dayStr, monthStr, yearStr ] = dateStr.split(".");

    if (
        !(isValidDigit(dayStr) && isValidDigit(monthStr) && isValidDigit(yearStr, 4, 4))
    ) return;

    const day = parseInt(dayStr);
    const month = parseInt(monthStr);
    const year = parseInt(yearStr);

    return new Date(year, month - 1, day);
}

export function isValidDigit(digitStr: string, minAllowedLength = 1, maxAllowedLength = 2) {
    return new RegExp(`^[0-9]{${minAllowedLength},${maxAllowedLength}}$`).test(digitStr);
}

export function isValidDateString(date: string) {
    return new Date(date).toString() != "Invalid Date";
}