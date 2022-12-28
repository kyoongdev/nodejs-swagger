interface TServer {
    url: string;
}
declare type TSwagger = {
    title: string;
    version: string;
    description: string;
    servers: TServer[];
};
declare type TSwaggerProps<T extends object> = {
    [K in keyof T]?: T[K];
};
declare class Swagger {
    private info;
    constructor(props: TSwaggerProps<TSwagger>);
}
