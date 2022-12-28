import { TProperty } from '../decorators/type';
import type { TRegisterBody, TRegisterParams, TRegisterResponse } from './type';
export declare const parceArrayJson: (arr: any[]) => Record<string, any>;
export declare const registerBody: (schemaName: string, isArray?: boolean) => TRegisterBody;
export declare const registerParams: (inName: string, properties: TProperty[]) => TRegisterParams;
export declare const registerResponse: (response: Record<string, any>) => TRegisterResponse;
