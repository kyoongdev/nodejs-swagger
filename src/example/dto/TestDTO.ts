import { Property } from 'decorators';
import TestDTO2 from './TestDTO2';

class TestDTO {
  @Property({ type: 'string' })
  name: string;

  @Property({ type: 'number' })
  age: number;

  @Property({ type: 'string', isArray: true })
  names: string[];

  @Property({ type: TestDTO2, isArray: true })
  testDto: TestDTO2[];
}

export default TestDTO;
