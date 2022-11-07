import type { TProperty, TRequestAPI, Type } from 'decorators/type';
import { Router } from 'express';

export type TPath = {
  params: TRequestAPI;
  properties: TProperty[];
};

export type TSwaggerDocuments = {
  tag: string;
  basePath: string;
  paths: TPath[];

  response: Record<string, any> | null;
};

export type TModelProperty = TProperty & {
  key: string;
};

export type TInstance = {
  instance: any;
  router: Router;
  swaggerDocs: TSwaggerDocuments;
};

export type TRegisterResponse = {
  responses: Record<string, any>;
  schemas: Array<Function | [Function] | Type<unknown> | undefined>;
};

export type TRegisterParams = {
  in: string;
  name: string | undefined;
  required: boolean;
  schema: {
    type: string | Function | [Function] | Type<unknown> | undefined;
  };
}[];

export type TRegisterBody = {
  required: boolean;
  content: {
    'application/json': {
      schema: {
        type: string;
        $ref: string;
      };
    };
  };
};
