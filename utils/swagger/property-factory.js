"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyFactory = void 0;
const constants_1 = require("../decorators/constants");
class PropertyFactory {
    constructor(properties) {
        this.getModelProperties = (prototype) => {
            const targets = this.parseProperties();
            const properties = targets.map((target) => {
                const property = Reflect.getMetadata(constants_1.DECORATORS.API_MODEL_PROPERTIES, prototype, target);
                return Object.assign(Object.assign({}, property), { key: target });
            });
            return properties;
        };
        this.parseProperties = () => {
            const properties = this.properties.map((property) => {
                const target = property.split(':')[1];
                return target;
            }, []);
            return properties;
        };
        this.properties = properties;
    }
}
exports.PropertyFactory = PropertyFactory;
//# sourceMappingURL=property-factory.js.map