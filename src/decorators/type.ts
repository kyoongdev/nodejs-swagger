export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export type BaseRequest = {
  description?: string;
  required?: boolean;
  example?: object | any;
};

export type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
