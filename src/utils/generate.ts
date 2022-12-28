interface TServer {
  url: string;
}

type TSwagger = {
  title: string;
  version: string;
  description: string;
  servers: TServer[];
};

type TSwaggerProps<T extends object> = {
  [K in keyof T]?: T[K];
};

export class Swagger {
  private info: TSwagger;

  constructor(props: TSwaggerProps<TSwagger>) {
    this.info = {
      description: props.description || '',
      servers: props.servers || [],
      title: props.title || '',
      version: props.version || '',
    };
  }
}
