import { Router } from 'express';

class DefaultController {
  route: Router;
  path: string;

  constructor(path: string) {
    this.path = path;
    this.route = Router();
  }
}

export default DefaultController;
