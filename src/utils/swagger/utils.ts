import { isNumber } from 'lodash';
import { TProperty, Type } from '../decorators/type';
import type { TRegisterBody, TRegisterParams, TRegisterResponse } from './type';

export const parceArrayJson = (arr: any[]) => arr.reduce<Record<string, any>>((acc, next) => ({ ...acc, ...next }), {});

export const registerBody = (schemaName: string, isArray?: boolean): TRegisterBody => {
  if (isArray) {
    return {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              $ref: `#/components/schemas/${schemaName}`,
            },
          },
        },
      },
    };
  }
  return {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          $ref: `#/components/schemas/${schemaName}`,
        },
      },
    },
  };
};

export const registerParams = (inName: string, properties: TProperty[]): TRegisterParams => {
  return properties.map((property) => {
    return {
      in: inName,
      name: property.key,
      required: !property.nullable,
      schema: {
        type: property.type,
      },
    };
  });
};

export const registerResponse = (response: Record<string, any>): TRegisterResponse => {
  const schemas: Array<Function | [Function] | Type<unknown> | undefined> = [];
  const responses = Object.entries(response).reduce<Record<string, any>>((acc, [key, value]) => {
    if (value.type) {
      acc[key] = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              $ref: `#/components/schemas/${(value.type as any).name}`,
            },
          },
        },
      };
      schemas.push(value.type);
    } else {
      acc[value.status] = {
        content: {
          'application/json': {
            schema: {
              properties: value.properties,
            },
          },
        },
      };
    }
    return acc;
  }, {});

  return {
    responses,
    schemas,
  };
};
