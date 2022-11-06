import type { TProperty, TRequestAPI } from 'decorators/type';
import { Router } from 'express';

export type TPath = {
  params: TRequestAPI;
  properties: TProperty[];
};

export type TSwaggerDocuments = {
  tag: string;
  basePath: string;
  paths: TPath[];
  summary?: string;
};

export type TModelProperty = TProperty & {
  key: string;
};

export type TInstance = {
  instance: any;
  router: Router;
  swaggerDocs: TSwaggerDocuments;
};
