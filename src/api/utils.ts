export enum QueryType {
    String = "string",
    Number = "number",
    Boolean = "boolean",
}

interface IQueryType {
    string: string
    boolean: boolean
    number: number
}

interface QuerySchema {
    [name: string]: keyof IQueryType
}

type TypedQuery<Type extends QuerySchema> = {
    [Property in keyof Type]: IQueryType[Type[Property]]
}

type ParseQueryResult<A extends QuerySchema, B extends QuerySchema> = TypedQuery<A> & (Partial<TypedQuery<B>>);

export function parseQuery<A extends QuerySchema, B extends QuerySchema>(
    query: {[key: string]: unknown},
    required: A,
    optional: B
): ParseQueryResult<A, B> {
 

    // FOR TESTING
    return "" as unknown as any;
}

