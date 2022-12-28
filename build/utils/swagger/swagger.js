"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lodash_1 = require("lodash");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const property_factory_1 = require("./property-factory");
const constants_1 = require("../decorators/constants");
const defaultSwagger_json_1 = __importDefault(require("./defaultSwagger.json"));
const utils_1 = require("./utils");
class SwaggerApplication {
    constructor(app) {
        this.initSwagger = (routers) => {
            const instances = routers.reduce((instances, router) => {
                const expressRouter = (0, express_1.Router)();
                const instance = new router();
                const { tag, path: basePath } = Reflect.getMetadata(constants_1.DECORATORS.API_TAGS, router);
                const methods = Object.getOwnPropertyNames(router.prototype).filter((item) => item !== 'constructor');
                const paths = methods.reduce((acc, next) => {
                    const params = Reflect.getMetadata(constants_1.DECORATORS.API_PARAMETERS, instance[next]);
                    const response = Reflect.getMetadata(constants_1.DECORATORS.API_RESPONSE, instance[next]);
                    params === null || params === void 0 ? void 0 : params.forEach((param) => {
                        acc.push({ params: param, properties: this.getProperties(param.type), response });
                        expressRouter[param.method](param.path, instance[next]);
                    });
                    return acc;
                }, []);
                instances.push({
                    instance,
                    router: expressRouter,
                    swaggerDocs: {
                        tag,
                        basePath,
                        paths,
                    },
                });
                return instances;
            }, []);
            this.initRouters(instances);
        };
        this.initRouters = (instances) => {
            this.generateSwagger(instances);
            instances.forEach(({ router, swaggerDocs }) => {
                this.app.use(swaggerDocs.basePath, router);
            });
        };
        this.generateSwagger = (instances) => {
            const swaggerDocs = (0, lodash_1.flatten)(instances.map((instance) => instance.swaggerDocs));
            const options = {
                swaggerOptions: {
                    url: '/swagger.json',
                },
            };
            this.app.get('/swagger.json', (req, res) => {
                res.status(200).json(this.generateSwaggerDocs(swaggerDocs));
            });
            this.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(undefined, options));
        };
        this.generateSwaggerDocs = (swaggerDocs) => {
            const schemaProps = [];
            const docs = swaggerDocs.reduce((acc, swaggerDoc) => {
                const { basePath, paths, tag } = swaggerDoc;
                const schemaObj = {
                    operationId: '',
                    tags: [tag],
                    summary: '',
                    requestBody: {},
                    parameters: [],
                };
                const schemas = paths.reduce((acc, next) => {
                    var _a, _b;
                    const { params, properties, response } = next;
                    const schemaName = params.type.name;
                    const schemaKeys = (0, lodash_1.flatten)(schemaProps.map((prop) => Object.keys(prop)));
                    if (!schemaKeys.includes(schemaName))
                        schemaProps.push(this.generateSchemas(schemaName, properties));
                    if (params.in === 'body') {
                        schemaObj['requestBody'] = (0, utils_1.registerBody)(schemaName, next.params.isArray);
                    }
                    else {
                        schemaObj['parameters'] = (0, utils_1.registerParams)(params.in || '', properties);
                    }
                    const responseObj = {
                        responses: {},
                    };
                    const { responses, schemas } = (0, utils_1.registerResponse)(response);
                    const responseSchemas = schemas === null || schemas === void 0 ? void 0 : schemas.map((schema) => {
                        return this.generateSchemas(schema.name, this.getProperties(schema));
                    });
                    responseObj.responses = responses;
                    schemaProps.push(...(responseSchemas ? responseSchemas : []));
                    schemaObj.operationId = `${params.method}:${basePath + params.path}`;
                    schemaObj.summary = (_a = params.summary) !== null && _a !== void 0 ? _a : '';
                    acc[basePath + params.path] = Object.assign(Object.assign({}, ((_b = acc[basePath + params.path]) !== null && _b !== void 0 ? _b : {})), { [params.method]: Object.assign(Object.assign({}, schemaObj), responseObj) });
                    return acc;
                }, {});
                acc.push(schemas);
                return acc;
            }, []);
            return Object.assign(Object.assign({}, defaultSwagger_json_1.default), { paths: (0, utils_1.parceArrayJson)(docs), components: {
                    schemas: (0, utils_1.parceArrayJson)(schemaProps),
                } });
        };
        this.generateSchemas = (name, properties) => {
            const required = properties.filter((property) => !property.nullable).map((property) => property.key);
            const schemas = [];
            const swaggerProperties = properties.reduce((acc, next) => {
                if (next.key) {
                    if (typeof next.type === 'string') {
                        acc[next.key] = Object.assign({ type: next.isArray ? 'array' : next.type }, (next.isArray
                            ? {
                                items: {
                                    type: next.type,
                                },
                            }
                            : {}));
                    }
                    else {
                        schemas.push(Object.assign({}, this.generateSchemas(next.type.name, this.getProperties(next.type))));
                        acc[next.key] = {
                            type: next.isArray ? 'array' : 'object',
                            items: {
                                $ref: `#/components/schemas/${next.type.name}`,
                            },
                        };
                    }
                }
                return acc;
            }, {});
            return Object.assign({ [name]: {
                    required,
                    properties: swaggerProperties,
                } }, (0, utils_1.parceArrayJson)(schemas));
        };
        this.getProperties = (type) => {
            const { prototype } = type;
            const properties = Reflect.getMetadata(constants_1.DECORATORS.API_MODEL_PROPERTIES_ARRAY, prototype) || [];
            const factory = new property_factory_1.PropertyFactory(properties);
            const modelProperties = factory.getModelProperties(prototype);
            return modelProperties;
        };
        this.app = app;
    }
}
exports.default = SwaggerApplication;
//# sourceMappingURL=swagger.js.map