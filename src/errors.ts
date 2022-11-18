export class ElementUndefinedError extends Error {
    constructor(element: string) {
        super(`${element} is undefined.`);
    }
}

export class InvalidDateError extends Error {
    constructor(date: any) {
        super(`Value ${date} could not be converted to a Date object.`)
    }
}