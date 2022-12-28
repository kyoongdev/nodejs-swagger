import type { TModelProperty } from './type';
export declare class PropertyFactory {
    private properties;
    constructor(properties: string[]);
    getModelProperties: (prototype: any) => TModelProperty[];
    parseProperties: () => string[];
}
