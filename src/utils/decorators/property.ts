import { isUndefined, negate, pickBy } from 'lodash';
import { DECORATORS, METADATA_FACTORY_NAME } from './constants';
import { TProperty } from './type';

export function createPropertyDecorator<T extends Record<string, any> = {}>(
  metakey: string,
  metadata: T,
  overrideExisting = true
): PropertyDecorator {
  return (target: object, propertyKey: string) => {
    const properties = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES_ARRAY, target) || [];

    const key = `:${propertyKey}`;
    if (!properties.includes(key)) {
      Reflect.defineMetadata(DECORATORS.API_MODEL_PROPERTIES_ARRAY, [...properties, `:${propertyKey}`], target);
    }
    const existingMetadata = Reflect.getMetadata(metakey, target, propertyKey);

    if (existingMetadata) {
      const newMetadata = pickBy(metadata, negate(isUndefined));
      const metadataToSave = overrideExisting
        ? {
            ...existingMetadata,
            ...newMetadata,
          }
        : {
            ...newMetadata,
            ...existingMetadata,
          };

      Reflect.defineMetadata(metakey, metadataToSave, target, propertyKey);
    } else {
      const type =
        (target?.constructor as any)?.[METADATA_FACTORY_NAME]?.()[propertyKey]?.type ??
        Reflect.getMetadata('design:type', target, propertyKey);

      Reflect.defineMetadata(
        metakey,
        {
          type,
          ...pickBy(metadata, negate(isUndefined)),
        },
        target,
        propertyKey
      );
    }
  };
}

export const Property = (property: TProperty) => {
  return createPropertyDecorator(DECORATORS.API_MODEL_PROPERTIES, property);
};
