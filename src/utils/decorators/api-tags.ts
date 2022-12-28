import { DECORATORS } from './constants';
import { createMixedDecorator } from './utils/helpers';

export type TApiTag = {
  tag: string;
  path: string;
};

export function ApiTags(props: TApiTag) {
  return createMixedDecorator(DECORATORS.API_TAGS, { ...props });
}
