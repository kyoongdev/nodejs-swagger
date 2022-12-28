export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export type BaseRequest = {
  description?: string;
  required?: boolean;
  example?: object | any;
};

export type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export type TProperty = {
  type?: Type<unknown> | Function | [Function] | string;
  default?: any;
  description?: string;
  name?: string;
  example?: any;
  isArray?: boolean;
  nullable?: boolean;
  items?: TProperty;
  required?: boolean;
  enum?: SwaggerEnumType;
  schema?: TProperty;
  key?: string;
};

export type TRequestAPI = {
  method: HTTPMethod;
  path: string;
  summary?: string;
  type?: Type<unknown> | Function | [Function] | string;
  in?: string;
  name?: string;
  required?: boolean;
  isArray?: boolean;
};

export type ParamDecorators<T extends Record<string, any> = any> = {
  metadata: T;
  initial: Partial<T>;
};
export type SwaggerEnumType = string[] | number[] | (string | number)[] | Record<number, string>;
export interface ApiMetadata extends TProperty {
  format?: string;
  enumName?: string;
  enum?: SwaggerEnumType;
}

export interface SchemaObjectMetadata extends Omit<TProperty, 'type'> {
  type?: Type<unknown> | Function | [Function] | string | Record<string, any>;
  isArray?: boolean;
  name?: string;
  enumName?: string;
}

export const defaultOptions: TProperty = {
  type: 'string',
  name: '',
  required: true,
};

export interface SwaggerRequestOptions {
  path: string;
  method: HTTPMethod;
  summary?: string;
  headers?: TProperty | TProperty[];
  params?: TProperty | TProperty[];
  query?: TProperty | TProperty[];
  body?: TProperty;
}

export type SwaggerResponseOptions = TProperty & {
  status?: number;
  schema?: any;
  isPaging?: boolean;
};
