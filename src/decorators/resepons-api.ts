import { omit } from 'lodash';
import { DECORATORS } from './constants';
import type { SwaggerResponseOptions } from './type';
import { getTypeIsArrayTuple } from './utils';

export const ResponseAPI = (props: SwaggerResponseOptions) => {
  const [type, isArray] = getTypeIsArrayTuple(props.type, props.isArray);
  props.type = type;
  props.isArray = isArray;
  props.description = props.description ?? '';

  const groupedMetadata = {
    [props.status || 'default']: omit(props, 'status'),
  };
  if (props.isPaging) {
    return (target: object, key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>): any => {
      if (descriptor) {
        const responses = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value) || {};

        Reflect.defineMetadata(
          DECORATORS.API_RESPONSE,
          {
            ...responses,
            ...groupedMetadata,

            schema: {
              status: props.status,
              properties: {
                paging: {
                  type: 'object',
                  properties: {
                    total: {
                      type: 'number',
                    },
                    page: {
                      type: 'number',
                    },
                    limit: {
                      type: 'number',
                    },
                    skip: {
                      type: 'number',
                    },
                    hasPrev: {
                      type: 'boolean',
                    },
                    hasNext: {
                      type: 'boolean',
                    },
                  },
                },
                data: {
                  type: 'array',
                  items: { $ref: `#/components/schemas/${(props.type as any).name}` },
                },
              },
            },
          },
          descriptor.value
        );
      }
    };
  } else {
    return (target: object, key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>): any => {
      if (descriptor) {
        const responses = Reflect.getMetadata(DECORATORS.API_RESPONSE, descriptor.value) || {};
        Reflect.defineMetadata(
          DECORATORS.API_RESPONSE,
          {
            ...responses,
            ...groupedMetadata,
          },
          descriptor.value
        );
        return descriptor;
      }
      const responses = Reflect.getMetadata(DECORATORS.API_RESPONSE, target) || {};
      Reflect.defineMetadata(
        DECORATORS.API_RESPONSE,
        {
          ...responses,
          ...groupedMetadata,
        },
        target
      );
      return target;
    };
  }
};
