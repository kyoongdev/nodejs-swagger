import { Router } from 'express';
import type { TProperty, TRequestAPI, Type } from '../decorators/type';
export declare type TPath = {
    params: TRequestAPI;
    properties: TProperty[];
    response: Record<string, any>;
};
export declare type TSwaggerDocuments = {
    tag: string;
    basePath: string;
    paths: TPath[];
};
export declare type TModelProperty = TProperty & {
    key: string;
};
export declare type TInstance = {
    instance: any;
    router: Router;
    swaggerDocs: TSwaggerDocuments;
};
export declare type TRegisterResponse = {
    responses: Record<string, any>;
    schemas: Array<Function | [Function] | Type<unknown> | undefined> | undefined;
};
export declare type TRegisterParams = {
    in: string;
    name: string | undefined;
    required: boolean;
    schema: {
        type: string | Function | [Function] | Type<unknown> | undefined;
    };
}[];
export declare type TRegisterBody = {
    required: boolean;
    content: {
        'application/json': {
            schema: {
                type: string;
                $ref?: string;
                items?: any;
            };
        };
    };
};
