"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestAPI = void 0;
const lodash_1 = require("lodash");
const constants_1 = require("./constants");
const request_utils_1 = require("./request-utils");
const RequestAPI = (props) => {
    const { headers, params, query, body, path, method, summary } = props;
    const paramDecorators = [];
    if (headers)
        paramDecorators.push(...(Array.isArray(headers) ? headers.map(request_utils_1.createHeader) : [(0, request_utils_1.createHeader)(headers)]));
    if (params)
        paramDecorators.push(...(Array.isArray(params) ? params.map(request_utils_1.createParam) : [(0, request_utils_1.createParam)(params)]));
    if (query)
        paramDecorators.push(...(Array.isArray(query) ? query.map(request_utils_1.createQuery) : [(0, request_utils_1.createQuery)(query)]));
    if (body)
        paramDecorators.push(...(Array.isArray(body) ? body.map(request_utils_1.createBody) : [(0, request_utils_1.createBody)(body)]));
    return (target, key, descriptor) => {
        for (const { metadata, initial } of paramDecorators) {
            if (descriptor) {
                const parameters = Reflect.getMetadata(constants_1.DECORATORS.API_PARAMETERS, descriptor.value) || [];
                Reflect.defineMetadata(constants_1.DECORATORS.API_PARAMETERS, [
                    ...parameters,
                    Object.assign(Object.assign(Object.assign({}, initial), { path,
                        summary,
                        method }), (0, lodash_1.pickBy)(metadata, (0, lodash_1.negate)(lodash_1.isUndefined))),
                ], descriptor.value);
            }
        }
        return descriptor;
    };
};
exports.RequestAPI = RequestAPI;
//# sourceMappingURL=request-api.js.map