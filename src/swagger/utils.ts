import type { TProperty, Type } from 'decorators/type';
import type { TRegisterBody, TRegisterParams, TRegisterResponse } from './type';

export const parceArrayJson = (arr: any[]) => arr.reduce<Record<string, any>>((acc, next) => ({ ...acc, ...next }), {});

export const registerBody = (schemaName: string): TRegisterBody => {
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
    return acc;
  }, {});

  return {
    responses,
    schemas,
  };
};
