import { isNil, isUndefined, negate, omit, pickBy } from 'lodash';
import type { ApiMetadata, ParamDecorators, TProperty } from './type';
import { defaultOptions } from './type';
import {
  addEnumArraySchema,
  addEnumSchema,
  getEnumType,
  getEnumValues,
  isEnumArray,
  isEnumDefined,
} from './utils/enum-utils';
import { getTypeIsArrayTuple } from './utils/helpers';

export const createParam = (params: TProperty): ParamDecorators => {
  const param: Record<string, any> = {
    in: 'path',
    ...omit(params, 'enum'),
  };

  const apiParamMetadata = params as ApiMetadata;
  if (apiParamMetadata.enum) {
    param.schema = param.schema || ({} as TProperty);

    const paramSchema = param.schema as TProperty;
    const enumValues = getEnumValues(apiParamMetadata.enum);
    paramSchema.type = getEnumType(enumValues);
    paramSchema.enum = enumValues;

    if (apiParamMetadata.enumName) {
      param.enumName = apiParamMetadata.enumName;
    }
  }
  return {
    metadata: param,
    initial: defaultOptions,
  };
};

export const createHeader = (headers: TProperty): ParamDecorators => {
  const param = pickBy<TProperty & { in: string }>(
    {
      name: isNil(headers.name) ? '' : headers.name,
      in: 'header',
      description: headers.description,
      required: headers.required,
      schema: {
        ...(headers.schema || {}),
        type: 'string',
      },
    },
    negate(isUndefined)
  );

  if (headers.enum) {
    const enumValues = getEnumValues(headers.enum);
    param.schema = {
      enum: enumValues,
      type: getEnumType(enumValues),
    };
  }
  return {
    metadata: param,
    initial: pickBy(headers, negate(isUndefined)),
  };
};

export const createQuery = (query: TProperty): ParamDecorators => {
  const apiQueryMetadata = query as ApiMetadata;
  const [type, isArray] = getTypeIsArrayTuple(apiQueryMetadata.type, apiQueryMetadata.isArray as boolean);
  const param: ApiMetadata & Record<string, any> = {
    name: isNil(query.name) ? '' : query.name,
    in: 'query',
    ...omit(query, 'enum'),
    type,
  };

  if (isEnumArray(query)) {
    addEnumArraySchema(param, query);
  } else if (isEnumDefined(query)) {
    addEnumSchema(param, query);
  }

  if (isArray) {
    param.isArray = isArray;
  }

  return {
    metadata: param,
    initial: defaultOptions,
  };
};

export const createBody = (body: TProperty): ParamDecorators => {
  const [type, isArray] = getTypeIsArrayTuple((body as TProperty).type, (body as TProperty).isArray as boolean);

  const param: TProperty & Record<string, any> = {
    in: 'body',
    ...omit(body, 'enum'),
    type,
    isArray,
  };

  if (isEnumArray(body)) {
    addEnumArraySchema(param, body);
  } else if (isEnumDefined(body)) {
    addEnumSchema(param, body);
  }

  return {
    metadata: param,
    initial: defaultOptions,
  };
};
