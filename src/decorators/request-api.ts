import { DECORATORS } from './constants';
import type { HTTPMethod, Type } from './type';

export type TRequestAPI = {
  method: HTTPMethod;
  path: string;
  type?: Type<unknown> | Function | [Function] | string;
};

export const RequestAPI = (props: TRequestAPI) => {
  console.log('RequestAPI');
  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    if (descriptor) {
      const parameters = Reflect.getMetadata(DECORATORS.API_PARAMETERS, descriptor.value) || [];

      Reflect.defineMetadata(
        DECORATORS.API_PARAMETERS,
        {
          ...props,
        },
        descriptor.value
      );
    }
  };
};
