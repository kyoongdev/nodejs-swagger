import type { Express } from 'express';
declare class SwaggerApplication {
    private app;
    constructor(app: Express);
    initSwagger: (routers: Array<Function>) => void;
    private initRouters;
    private generateSwagger;
    private generateSwaggerDocs;
    private generateSchemas;
    private getProperties;
}
export default SwaggerApplication;
