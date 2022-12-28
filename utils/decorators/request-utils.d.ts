import type { ParamDecorators, TProperty } from './type';
export declare const createParam: (params: TProperty) => ParamDecorators;
export declare const createHeader: (headers: TProperty) => ParamDecorators;
export declare const createQuery: (query: TProperty) => ParamDecorators;
export declare const createBody: (body: TProperty) => ParamDecorators;
