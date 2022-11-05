export function createMethodDecorator<T = any>(metakey: string, metadata: T): MethodDecorator {
  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(metakey, metadata, descriptor.value);
    return descriptor;
  };
}
export function createMixedDecorator<T = any>(metakey: string, metadata: T): MethodDecorator & ClassDecorator {
  return (target: object, key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>): any => {
    if (descriptor) {
      let metadatas: any;
      if (Array.isArray(metadata)) {
        const previousMetadata = Reflect.getMetadata(metakey, descriptor.value) || [];
        metadatas = [...previousMetadata, ...metadata];
      } else {
        const previousMetadata = Reflect.getMetadata(metakey, descriptor.value) || {};
        metadatas = { ...previousMetadata, ...metadata };
      }
      Reflect.defineMetadata(metakey, metadatas, descriptor.value);
      return descriptor;
    }
    Reflect.defineMetadata(metakey, metadata, target);
    return target;
  };
}
