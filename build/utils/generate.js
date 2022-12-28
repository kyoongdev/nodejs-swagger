"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swagger = void 0;
class Swagger {
    constructor(props) {
        this.info = {
            description: props.description || '',
            servers: props.servers || [],
            title: props.title || '',
            version: props.version || '',
        };
    }
}
exports.Swagger = Swagger;
//# sourceMappingURL=generate.js.map