import { TProperty } from 'decorators/type';

export const parceArrayJson = (arr: any[]) => arr.reduce<Record<string, any>>((acc, next) => ({ ...acc, ...next }), {});

export const registerBody = (schemaName: string) => {
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

export const registerParams = (inName: string, properties: TProperty[]) => {
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
