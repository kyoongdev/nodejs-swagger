import { TApiTag } from 'decorators/api-tags';
import { DECORATORS } from 'decorators/constants';
import type { TProperty, TRequestAPI, Type } from 'decorators/type';
import type { Express } from 'express';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { PropertyFactory } from './property-factory';
import type { TInstance, TModelProperty, TPath, TSwaggerDocuments } from './type';

import defaultSwagger from './defaultSwagger.json';

class SwaggerApplication {
  private app: Express;

  constructor(app: Express) {
    this.app = app;
  }

  public initSwagger = (routers: Array<Function>) => {
    const instances = routers.reduce<TInstance[]>((instances, router) => {
      const expressRouter = Router() as any;
      const instance = new (router as any)();

      const { tag, path }: TApiTag = Reflect.getMetadata(DECORATORS.API_TAGS, router);

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
          basePath: path,
          paths,
        },
      });
      return instances;
    }, []);

    this.generateSwagger(instances);
    this.initRouters(instances);
  };

  private initRouters = (instances: TInstance[]) => {
    instances.forEach(({ router, swaggerDocs }) => {
      this.app.use(swaggerDocs.basePath, router);
    });
  };

  private generateSwagger = (instances: TInstance[]) => {
    const swaggerDocs = instances.reduce<TSwaggerDocuments[]>((acc, next) => {
      const { swaggerDocs } = next;
      acc.push(swaggerDocs);
      return acc;
    }, []);

    const definitionProps: any[] = [];

    const docs = swaggerDocs.reduce<Record<string, any>>((acc, swaggerDoc) => {
      const { basePath, paths, tag } = swaggerDoc;

      const pathName = basePath + paths[0].params.path;
      const method = paths[0].params.method;

      const pathDocs = paths.reduce<Record<string, any>>((acc, next) => {
        const { params, properties } = next;

        const definitionName = (params.type as any).name;

        definitionProps.push(this.generateDefinitions(definitionName, properties));
        console.log(properties);
        if (params.in === 'body') {
          acc['requestBody'] = {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  $ref: `#/components/schemas/${definitionName}`,
                },
              },
            },
          };
        } else {
          acc['parameters'] = properties.map((property) => {
            return {
              in: params.in,
              name: property.key,
              required: !property.nullable,
              schema: {
                type: property.type,
              },
            };
          });
        }

        return acc;
      }, {});

      acc[pathName] = {
        [method]: {
          tags: [tag],
          ...pathDocs,
        },
      };
      return acc;
    }, {});

    const definitions = definitionProps.reduce<Record<string, any>>((acc, next) => {
      return { ...acc, ...next };
    }, {});

    const swaggerApiDocs = {
      ...defaultSwagger,
      paths: docs,
      definitions,
      components: {
        schemas: definitions,
      },
    };

    const options = {
      swaggerOptions: {
        url: '/swagger.json',
      },
    };
    this.app.get('/swagger.json', (req, res) => {
      res.status(200).json(swaggerApiDocs);
    });
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, options));
  };

  private generateDefinitions = (name: string, properties: TProperty[]) => {
    const required = properties.filter((property) => !property.nullable).map((property) => property.key);
    const definitions: any[] = [];
    const swaggerProperties = properties.reduce<Record<string, any>>((acc, next) => {
      if (next.key) {
        if (!next.isArray) {
          if (typeof next.type === 'string') {
            acc[next.key] = {
              type: next.type,
            };
          } else {
            acc[next.key] = {
              type: 'object',
              items: {
                $ref: `#/definitions/${name}`,
              },
            };
          }
        } else {
          if (typeof next.type === 'string') {
            acc[next.key] = {
              type: 'array',
              items: {
                type: next.type,
              },
            };
          } else {
            definitions.push({ ...this.generateDefinitions((next.type as any).name, this.getProperties(next.type)) });

            acc[next.key] = {
              type: 'array',
              items: {
                $ref: `#/definitions/${name}`,
              },
            };
          }
        }
      }

      return acc;
    }, {});

    const additionalDefinitions = definitions.reduce<Record<string, any>>((acc, next) => {
      return { ...acc, ...next };
    }, {});

    return {
      [name]: {
        required,
        properties: swaggerProperties,
      },
      ...additionalDefinitions,
    };
  };

  private getProperties = (type?: Function | Type<unknown> | [Function] | undefined): TModelProperty[] => {
    const { prototype } = type as any;

    const properties = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES_ARRAY, prototype) || [];
    const factory = new PropertyFactory(properties);
    const modelProperties = factory.getModelProperties(prototype);
    return modelProperties;
  };

  private getParameters = (inName: string, properties: TProperty[]) => {
    return properties.map((property) => {
      const { key, type, isArray, nullable } = property;
      return {
        in: inName,
        name: key,
        required: !nullable,
        type: isArray ? 'array' : type,
      };
    });
  };
}

export default SwaggerApplication;
