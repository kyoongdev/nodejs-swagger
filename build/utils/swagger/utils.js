"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerResponse = exports.registerParams = exports.registerBody = exports.parceArrayJson = void 0;
const parceArrayJson = (arr) => arr.reduce((acc, next) => (Object.assign(Object.assign({}, acc), next)), {});
exports.parceArrayJson = parceArrayJson;
const registerBody = (schemaName, isArray) => {
    if (isArray) {
        return {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: {
                            type: 'object',
                            $ref: `#/components/schemas/${schemaName}`,
                        },
                    },
                },
            },
        };
    }
    return {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    $ref: `#/components/schemas/${schemaName}`,
                },
            },
        },
    };
};
exports.registerBody = registerBody;
const registerParams = (inName, properties) => {
    return properties.map((property) => {
        return {
            in: inName,
            name: property.key,
            required: !property.nullable,
            schema: {
                type: property.type,
            },
        };
    });
};
exports.registerParams = registerParams;
const registerResponse = (response) => {
    const schemas = [];
    if (!response)
        return {
            responses: {},
            schemas: undefined,
        };
    const responses = Object.entries(response).reduce((acc, [key, value]) => {
        if (value.type) {
            acc[key] = {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            $ref: `#/components/schemas/${value.type.name}`,
                        },
                    },
                },
            };
            schemas.push(value.type);
        }
        else {
            acc[value.status] = {
                content: {
                    'application/json': {
                        schema: {
                            properties: value.properties,
                        },
                    },
                },
            };
        }
        return acc;
    }, {});
    return {
        responses,
        schemas,
    };
};
exports.registerResponse = registerResponse;
//# sourceMappingURL=utils.js.map