import { DECORATORS } from './constants';

export const Property = () => {
  return (target: object, propertyKey: string) => {
    Reflect.defineMetadata(
      DECORATORS.API_MODEL_PROPERTIES,
      {
        property: 'property',
      },
      target,
      propertyKey
    );
  };
};
