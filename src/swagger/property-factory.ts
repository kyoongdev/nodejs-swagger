import { DECORATORS } from 'decorators/constants';
import type { TModelProperty } from './type';

export class PropertyFactory {
  private properties: string[];

  constructor(properties: string[]) {
    this.properties = properties;
  }

  getModelProperties = (prototype: any): TModelProperty[] => {
    const targets = this.parseProperties();
    const properties = targets.map((target) => {
      const property = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES, prototype, target);

      return { ...property, key: target };
    });

    return properties;
  };

  parseProperties = () => {
    const properties = this.properties.map((property) => {
      const target = property.split(':')[1];
      return target;
    }, []);
    return properties;
  };
}
