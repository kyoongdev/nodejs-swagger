import { TApiTag } from 'decorators/api-tags';
import { DECORATORS } from 'decorators/constants';
import type { TProperty, TRequestAPI, Type } from 'decorators/type';
import type { Express } from 'express';
import { Router } from 'express';
import { flatten } from 'lodash';
import swaggerUi from 'swagger-ui-express';
import { PropertyFactory } from './property-factory';
import type { TInstance, TModelProperty, TPath, TSwaggerDocuments } from './type';

import defaultSwagger from './defaultSwagger.json';
import { parceArrayJson, registerBody, registerParams } from './utils';

class SwaggerApplication {
  private app: Express;

  constructor(app: Express) {
    this.app = app;
  }

  public initSwagger = (routers: Array<Function>) => {
    const instances = routers.reduce<TInstance[]>((instances, router) => {
      const expressRouter = Router() as any;
      const instance = new (router as any)();

      const { tag, path: basePath }: TApiTag = Reflect.getMetadata(DECORATORS.API_TAGS, router);

      const methods = Object.getOwnPropertyNames(router.prototype).filter((item) => item !== 'constructor');

      const paths = methods.reduce<Array<TPath>>((acc, next) => {
        const params: TRequestAPI[] = Reflect.getMetadata(DECORATORS.API_PARAMETERS, instance[next]);

        params.forEach((param) => {
          acc.push({ params: param, properties: this.getProperties(param.type as any) });
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

  private initRouters = (instances: TInstance[]) => {
    this.generateSwagger(instances);
    instances.forEach(({ router, swaggerDocs }) => {
      this.app.use(swaggerDocs.basePath, router);
    });
  };

  private generateSwagger = (instances: TInstance[]) => {
    const swaggerDocs = flatten(instances.map((instance): TSwaggerDocuments => instance.swaggerDocs));

    const options = {
      swaggerOptions: {
        url: '/swagger.json',
      },
    };
    this.app.get('/swagger.json', (req, res) => {
      res.status(200).json(this.generateSwaggerDocs(swaggerDocs));
    });
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, options));
  };

  private generateSwaggerDocs = (swaggerDocs: TSwaggerDocuments[]) => {
    const schemaProps: any[] = [];

    const docs = swaggerDocs.reduce<Record<string, any>>((acc, swaggerDoc) => {
      const { basePath, paths, tag } = swaggerDoc;

      const schemaObj: Record<string, any> = {
        operationId: '',
        tags: [tag],
        summary: '',
        requestBody: {},
        parameters: [],
      };
      return paths.reduce<Record<string, any>>((acc, next) => {
        const { params, properties } = next;

        const schemaName = (params.type as any).name;
        schemaProps.push(this.generateSchemas(schemaName, properties));

        if (params.in === 'body') {
          schemaObj['requestBody'] = registerBody(schemaName);
        } else {
          schemaObj['parameters'] = registerParams(params.in || '', properties);
        }
        schemaObj.operationId = `${params.method}:${basePath + params.path}`;
        schemaObj.summary = params.summary ?? '';
        acc[basePath + params.path] = {
          ...(acc[basePath + params.path] ?? {}),
          [params.method]: {
            ...schemaObj,
          },
        };

        return acc;
      }, {});
    }, {});

    return {
      ...defaultSwagger,
      paths: docs,
      components: {
        schemas: parceArrayJson(schemaProps),
      },
    };
  };

  private generateSchemas = (name: string, properties: TProperty[]) => {
    const required = properties.filter((property) => !property.nullable).map((property) => property.key);
    const schemas: any[] = [];

    const swaggerProperties = properties.reduce<Record<string, any>>((acc, next) => {
      if (next.key) {
        if (typeof next.type === 'string') {
          acc[next.key] = {
            type: next.isArray ? 'array' : next.type,
            ...(next.isArray
              ? {
                  items: {
                    type: next.type,
                  },
                }
              : {}),
          };
        } else {
          schemas.push({ ...this.generateSchemas((next.type as any).name, this.getProperties(next.type)) });
          acc[next.key] = {
            type: next.isArray ? 'array' : 'object',
            items: {
              $ref: `#/components/schemas/${(next.type as any).name}`,
            },
          };
        }
      }

      return acc;
    }, {});

    return {
      [name]: {
        required,
        properties: swaggerProperties,
      },
      ...parceArrayJson(schemas),
    };
  };

  private getProperties = (type?: Function | Type<unknown> | [Function] | undefined): TModelProperty[] => {
    const { prototype } = type as any;

    const properties = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES_ARRAY, prototype) || [];
    const factory = new PropertyFactory(properties);
    const modelProperties = factory.getModelProperties(prototype);
    return modelProperties;
  };
}

export default SwaggerApplication;
