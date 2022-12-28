import { isUndefined, negate, pickBy } from 'lodash';
import { DECORATORS } from './constants';
import { createBody, createHeader, createParam, createQuery } from './request-utils';
import type { ParamDecorators, SwaggerRequestOptions } from './type';

export const RequestAPI = (props: SwaggerRequestOptions) => {
  const { headers, params, query, body, path, method, summary } = props;
  const paramDecorators: ParamDecorators[] = [];

  if (headers) paramDecorators.push(...(Array.isArray(headers) ? headers.map(createHeader) : [createHeader(headers)]));
  if (params) paramDecorators.push(...(Array.isArray(params) ? params.map(createParam) : [createParam(params)]));
  if (query) paramDecorators.push(...(Array.isArray(query) ? query.map(createQuery) : [createQuery(query)]));
  if (body) paramDecorators.push(...(Array.isArray(body) ? body.map(createBody) : [createBody(body)]));

  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    for (const { metadata, initial } of paramDecorators) {
      if (descriptor) {
        const parameters = Reflect.getMetadata(DECORATORS.API_PARAMETERS, descriptor.value) || [];

        console.log(metadata);

        Reflect.defineMetadata(
          DECORATORS.API_PARAMETERS,
          [
            ...parameters,
            {
              ...initial,
              path,
              summary,
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
