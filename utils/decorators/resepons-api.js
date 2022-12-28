"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseAPI = void 0;
const lodash_1 = require("lodash");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const ResponseAPI = (props) => {
    var _a;
    const [type, isArray] = (0, utils_1.getTypeIsArrayTuple)(props.type, props.isArray);
    props.type = type;
    props.isArray = isArray;
    props.description = (_a = props.description) !== null && _a !== void 0 ? _a : '';
    const groupedMetadata = {
        [props.status || 'default']: (0, lodash_1.omit)(props, 'status'),
    };
    if (props.isPaging) {
        return (target, key, descriptor) => {
            if (descriptor) {
                const responses = Reflect.getMetadata(constants_1.DECORATORS.API_RESPONSE, descriptor.value) || {};
                Reflect.defineMetadata(constants_1.DECORATORS.API_RESPONSE, Object.assign(Object.assign(Object.assign({}, responses), groupedMetadata), { schema: {
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
                                items: { $ref: `#/components/schemas/${props.type.name}` },
                            },
                        },
                    } }), descriptor.value);
            }
        };
    }
    else {
        return (target, key, descriptor) => {
            if (descriptor) {
                const responses = Reflect.getMetadata(constants_1.DECORATORS.API_RESPONSE, descriptor.value) || {};
                Reflect.defineMetadata(constants_1.DECORATORS.API_RESPONSE, Object.assign(Object.assign({}, responses), groupedMetadata), descriptor.value);
                return descriptor;
            }
            const responses = Reflect.getMetadata(constants_1.DECORATORS.API_RESPONSE, target) || {};
            Reflect.defineMetadata(constants_1.DECORATORS.API_RESPONSE, Object.assign(Object.assign({}, responses), groupedMetadata), target);
            return target;
        };
    }
};
exports.ResponseAPI = ResponseAPI;
//# sourceMappingURL=resepons-api.js.map