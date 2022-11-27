import assert from "assert"

export enum QueryType {
    String = "string",
    Date = "date",
    Float = "float",
    NegativeFloat = "negativeFloat",
    PositiveFloat = "positiveFloat",
    Int = "int",
    NegativeInt = "negativeInt",
    PositiveInt = "positiveInt",
    Boolean = "boolean",
}

interface IQueryType {
    string: string
    boolean: boolean
    int: number
    negativeInt: number
    positiveInt: number
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
): ParseQueryResult<A, B> {
    for (const template of Object.entries(required)) {
        const exists = Object.hasOwn(query, template[0]);
        assert(exists);
        checkAgainstTemplate(query[template[0]], ...template);
    }
    // FOR TESTING
    return "" as unknown as any;
}

function checkAgainstTemplate(queryValue: unknown, name: string, type: keyof IQueryType) {
       switch (type) {
        case QueryType.Boolean:
            return parseBoolean(queryValue)
        case QueryType.Int:
            return parseInteger(queryValue)
       
        default:
            return queryValue as string
       }
}

function parseBoolean(value: unknown) {
    if (typeof value != "string") throw new Error("");
    
    if (value == "true") {
        return true;
    }
    if (value == "false") {
        return false;
    }
    throw new Error("");
}

function parseInteger(value: unknown) {
    const num = Number(value);
    const isNumeric = !isNaN(num);
    assert(isNumeric);
    
    const isInteger = Number.isInteger(num);
    assert(isInteger);

    return num;
}