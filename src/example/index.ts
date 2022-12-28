import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import { RequestAPI, ResponseAPI } from '../utils/decorators';
import { ApiTags } from '../utils/decorators/api-tags';

import { EmptyResponse, TestDTO, TestDTO2 } from './dto';

@ApiTags({ path: '/test', tag: 'test' })
export class Test {
  router: Router;

  constructor() {
    this.router = Router();
  }

  @RequestAPI({
    path: '',
    method: 'get',

    query: {
      type: TestDTO2,
    },
  })
  @ResponseAPI({
    type: TestDTO,
    status: 200,
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
  @ResponseAPI({
    type: TestDTO2,
    isPaging: true,
    status: 200,
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
  @ResponseAPI({
    type: EmptyResponse,
    status: 204,
  })
  public test3(req: Request, res: Response, next: NextFunction) {
    res.status(200).send('hello');
  }
}

@ApiTags({ path: '/test2', tag: 'test2' })
export class Test2 {
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
  @ResponseAPI({
    type: TestDTO,
    status: 200,
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
  @ResponseAPI({
    type: TestDTO2,
    isPaging: true,
    status: 200,
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
  @ResponseAPI({
    type: EmptyResponse,
    status: 204,
  })
  public test3(req: Request, res: Response, next: NextFunction) {
    res.status(200).send('hello');
  }
}
