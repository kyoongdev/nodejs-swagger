import { Property } from '../../utils/decorators';

class TestDTO2 {
  @Property({ type: 'string' })
  adsfasd: string;

  @Property({ type: 'number' })
  sdfsa: number;
}
export default TestDTO2;
