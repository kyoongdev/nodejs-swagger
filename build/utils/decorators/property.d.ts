import { TProperty } from './type';
export declare function createPropertyDecorator<T extends Record<string, any> = {}>(metakey: string, metadata: T, overrideExisting?: boolean): PropertyDecorator;
export declare const Property: (property: TProperty) => PropertyDecorator;
