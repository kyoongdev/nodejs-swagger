"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeIsArrayTuple = exports.createMixedDecorator = exports.createMethodDecorator = void 0;
const lodash_1 = require("lodash");
function createMethodDecorator(metakey, metadata) {
    return (target, key, descriptor) => {
        Reflect.defineMetadata(metakey, metadata, descriptor.value);
        return descriptor;
    };
}
exports.createMethodDecorator = createMethodDecorator;
function createMixedDecorator(metakey, metadata) {
    return (target, key, descriptor) => {
        if (descriptor) {
            let metadatas;
            if (Array.isArray(metadata)) {
                const previousMetadata = Reflect.getMetadata(metakey, descriptor.value) || [];
                metadatas = [...previousMetadata, ...metadata];
            }
            else {
                const previousMetadata = Reflect.getMetadata(metakey, descriptor.value) || {};
                metadatas = Object.assign(Object.assign({}, previousMetadata), metadata);
            }
            Reflect.defineMetadata(metakey, metadatas, descriptor.value);
            return descriptor;
        }
        Reflect.defineMetadata(metakey, metadata, target);
        return target;
    };
}
exports.createMixedDecorator = createMixedDecorator;
function getTypeIsArrayTuple(input, isArrayFlag) {
    if (!input) {
        return [input, isArrayFlag !== null && isArrayFlag !== void 0 ? isArrayFlag : false];
    }
    if (isArrayFlag) {
        return [input, isArrayFlag];
    }
    const isInputArray = (0, lodash_1.isArray)(input);
    const type = isInputArray ? input[0] : input;
    return [type, isInputArray];
}
exports.getTypeIsArrayTuple = getTypeIsArrayTuple;
//# sourceMappingURL=helpers.js.map