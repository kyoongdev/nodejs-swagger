"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiTags = void 0;
const constants_1 = require("./constants");
const helpers_1 = require("./utils/helpers");
function ApiTags(props) {
    return (0, helpers_1.createMixedDecorator)(constants_1.DECORATORS.API_TAGS, Object.assign({}, props));
}
exports.ApiTags = ApiTags;
//# sourceMappingURL=api-tags.js.map