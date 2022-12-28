export declare function createMethodDecorator<T = any>(metakey: string, metadata: T): MethodDecorator;
export declare function createMixedDecorator<T = any>(metakey: string, metadata: T): MethodDecorator & ClassDecorator;
export declare function getTypeIsArrayTuple(input: Function | [Function] | undefined | string | Record<string, any>, isArrayFlag?: boolean): [Function | undefined, boolean];
