import assert from "assert"

export enum QueryType {
    String = "string",
    Integer = "integer",
    Boolean = "boolean",
}

interface IQueryType {
    string: string
    boolean: boolean
    integer: number
}

interface QueryTemplate {
    [name: string]: keyof IQueryType
}

type TypedQuery<Type extends QueryTemplate> = {
    [Property in keyof Type]: IQueryType[Type[Property]]
}

type ParseQueryResult<A extends QueryTemplate, B extends QueryTemplate> = TypedQuery<A> & (Partial<TypedQuery<B>>);

export function parseQuery<A extends QueryTemplate, B extends QueryTemplate>(
    query: {[key: string]: unknown},
    required: A,
    optional: B
): ParseQueryResult<A, B> {
    const requiredMapped = Object.entries(required).map(queryTemplateMapper(false)); 
    const optionalMapped = Object.entries(required).map(queryTemplateMapper(true)); 

    const templateParams = [...requiredMapped, ...optionalMapped];

    for (const templateParam of templateParams) {
        const exists = Object.hasOwn(query, templateParam.name);
        if (!templateParam.isOptional) {
            assert(exists);
        }

        const value = query[templateParam.name];

        switch (templateParam.type) {
            case QueryType.Integer:
                parseInteger(value);
                break;
        
            default:
                break;
        }
    }

    // FOR TESTING
    return "" as unknown as any;
}

function parseInteger(value: unknown) {
    const num = Number(value);
    const isNumeric = !isNaN(num);
    assert(isNumeric);
    
    const isInteger = Number.isInteger(num);
    assert(isInteger);

    return num;
}

function queryTemplateMapper(isOptional: boolean) {
    return function([name, type]: [string, keyof IQueryType]) {
        return { name, type, isOptional }   
    }
}