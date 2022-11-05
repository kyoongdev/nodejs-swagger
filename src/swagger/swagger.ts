import { DECORATORS } from 'decorators/constants';
import type { Express, RouterOptions } from 'express';
import { Router } from 'express';

class SwaggerApplication {
  private app: Express;
  constructor(app: Express) {
    this.app = app;
  }

  public initSwagger = (routers: Array<Function>) => {
    const instances = routers.map((router) => {
      const expressRouter = Router() as any;
      const instance = new (router as any)();

      const tags = Reflect.getMetadata(DECORATORS.API_TAGS, router);
      const methods = Object.getOwnPropertyNames(router.prototype).filter((item) => item !== 'constructor');

      const paths = methods.reduce<Array<Object>>((acc, next) => {
        const metaData = Reflect.getMetadata(DECORATORS.API_PARAMETERS, instance[next]);
        if (metaData) {
          acc.push(metaData);
          console.log({ metaData });

          expressRouter[metaData.method](metaData.path, instance[next]);
        }
        return acc;
      }, []);

      console.log({ paths });

      return {
        instance,
        router: expressRouter,
      };
    });
    this.initRouters(instances);
  };

  private initRouters = (instances: Array<any>) => {
    instances.forEach(({ instance, router }) => {
      this.app.use(instance.path, router);
    });
  };
}

export default SwaggerApplication;
