import { RequestAPI } from 'decorators';
import { ApiTags } from 'decorators/api-tags';
import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';

import { TestDTO, TestDTO2 } from './dto';

@ApiTags({ path: '/test', tag: 'test' })
export class Test {
  router: Router;

  constructor() {
    this.router = Router();
  }

  @RequestAPI({
    path: '/real',
    method: 'get',
    body: {
      type: TestDTO,
    },
    query: {
      type: TestDTO2,
    },
  })
  public test(req: Request, res: Response, next: NextFunction) {
    res.status(200).send('hello');
  }

  @RequestAPI({
    path: '/realy',
    method: 'get',
    summary: 'ssss',
    body: {
      type: TestDTO,
    },
    query: {
      type: TestDTO,
    },
  })
  public test2(req: Request, res: Response, next: NextFunction) {
    res.status(200).send('hello');
  }

  @RequestAPI({
    path: '/realy',
    method: 'post',
    body: {
      type: TestDTO,
    },
    query: {
      type: TestDTO,
    },
  })
  public test3(req: Request, res: Response, next: NextFunction) {
    res.status(200).send('hello');
  }
}
