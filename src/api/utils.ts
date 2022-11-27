import assert from "assert"

export enum QueryType {
    String = "string",
    Date = "date",
    Float = "float",
    Int = "int",
    Boolean = "boolean",
}

interface IQueryType {
    string: string
    boolean: boolean
    int: number
    float: number
    date: Date
}

interface QueryTemplate {
    [name: string]: keyof IQueryType
}
interface UnknownQuery {
    [key: string]: unknown
}
type TypedQuery<Type extends QueryTemplate> = {
    [Property in keyof Type]: IQueryType[Type[Property]]
}

type ParseQueryResult<A extends QueryTemplate, B extends QueryTemplate> = TypedQuery<A> & (Partial<TypedQuery<B>>);

export function parseQuery<A extends QueryTemplate, B extends QueryTemplate>(
    query: UnknownQuery,
    required: A,
    optional: B
): ParseQueryResult<A, B> | string {
    const result: {[key: string]: unknown} = {};

    try {
        for (const template of Object.entries(required)) {
            const exists = Object.hasOwn(query, template[0]);
            assert(exists);
            result[template[0]] = checkAgainstTemplate(query[template[0]], ...template);
        }
        for (const template of Object.entries(optional)) {
            const exists = Object.hasOwn(query, template[0]);
            if (!exists) continue;
            result[template[0]] = checkAgainstTemplate(query[template[0]], ...template);
        }
    }catch(err) {
        // TODO: detect the error type so it can be sent to the user.
        return "Unknown error";
    }
    return result as ParseQueryResult<A, B>;
}

function checkAgainstTemplate(queryValue: unknown, name: string, type: keyof IQueryType) {
    switch (type) {
        case QueryType.Boolean:
            return parseQueryBoolean(queryValue);
        case QueryType.Int:
            return parseQueryInteger(queryValue);
        case QueryType.Float:
            return parseQueryFloat(queryValue);
        case QueryType.Date:
            return parseQueryDate(queryValue);
        default:
            return queryValue as string
    }
}

function parseQueryBoolean(value: unknown) {
    if (typeof value != "string") throw new Error("");
    
    if (value == "true") {
        return true;
    }
    if (value == "false") {
        return false;
    }
    throw new Error("");
}

function isNumeric(value: unknown) {
    if (typeof value != "string") return false;
    return !isNaN(value as unknown as number) && !isNaN(parseFloat(value));
}

function parseQueryInteger(value: unknown) {
    const isNum = isNumeric(value);
    assert(isNum);

    const num = +(value as string);

    assert(Number.isInteger(num));

    return num;
}
function parseQueryFloat(value: unknown) {
    const isNum = isNumeric(value);
    assert(isNum);

    const num = +(value as string);
    return num;
}

export function parseQueryDate(value: unknown) {
    assert(typeof value == "string");
    const [ dayStr, monthStr, yearStr ] = value.split(".");

    assert(isValidDigit(dayStr) && isValidDigit(monthStr) && isValidDigit(yearStr, 4, 4));

    const day = parseInt(dayStr);
    const month = parseInt(monthStr);
    const year = parseInt(yearStr);

    return new Date(year, month - 1, day);
}

export function isValidDigit(digitStr: string, minAllowedLength = 1, maxAllowedLength = 2) {
    return new RegExp(`^[0-9]{${minAllowedLength},${maxAllowedLength}}$`).test(digitStr);
}