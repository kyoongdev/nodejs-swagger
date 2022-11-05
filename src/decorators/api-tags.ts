import { DECORATORS } from './constants';
import { createMixedDecorator } from './utils/helpers';

export function ApiTags(...tags: string[]) {
  return createMixedDecorator(DECORATORS.API_TAGS, tags);
}
