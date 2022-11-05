import { Property, RequestAPI } from 'decorators';
import { ApiTags } from 'decorators/api-tags';
import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';

class TestDTO {
  @Property()
  name?: string;

  @Property()
  age?: number;
}

@ApiTags('hello')
export class Test {
  router: Router;
  path = '/test';
  constructor() {
    this.router = Router();
  }

  @RequestAPI({
    path: '/real',
    method: 'get',
    type: TestDTO,
  })
  public test(req: Request, res: Response, next: NextFunction) {
    res.status(200).send('hello');
  }
}
