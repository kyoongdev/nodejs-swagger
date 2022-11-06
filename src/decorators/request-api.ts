import { isUndefined, negate, pickBy } from 'lodash';
import { DECORATORS } from './constants';
import type { ParamDecorators, SwaggerOptions } from './type';
import { createBody, createHeader, createParam, createQuery } from './utils';

export const RequestAPI = (props: SwaggerOptions) => {
  const { headers, params, query, body, path, method } = props;
  const paramDecorators: ParamDecorators[] = [];

  if (headers) paramDecorators.push(...(Array.isArray(headers) ? headers.map(createHeader) : [createHeader(headers)]));
  if (params) paramDecorators.push(...(Array.isArray(params) ? params.map(createParam) : [createParam(params)]));
  if (query) paramDecorators.push(...(Array.isArray(query) ? query.map(createQuery) : [createQuery(query)]));
  if (body) paramDecorators.push(...(Array.isArray(body) ? body.map(createBody) : [createBody(body)]));

  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    for (const { metadata, initial } of paramDecorators) {
      if (descriptor) {
        const parameters = Reflect.getMetadata(DECORATORS.API_PARAMETERS, descriptor.value) || [];

        Reflect.defineMetadata(
          DECORATORS.API_PARAMETERS,
          [
            ...parameters,
            {
              ...initial,
              path,
              method,
              ...pickBy(metadata, negate(isUndefined)),
            },
          ],
          descriptor.value
        );
      }
    }

    return descriptor;
  };
};
