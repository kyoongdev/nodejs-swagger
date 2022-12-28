export declare type TApiTag = {
    tag: string;
    path: string;
};
export declare function ApiTags(props: TApiTag): MethodDecorator & ClassDecorator;
