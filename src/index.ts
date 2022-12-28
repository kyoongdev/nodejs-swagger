import express from 'express';
import 'reflect-metadata';

import { Test } from './example';
import { SwaggerApplication } from './utils';

const app = express();

const swaggerApplication = new SwaggerApplication(app);
swaggerApplication.initSwagger([Test]);

app.listen(8000, () => {
  console.log('Server is running');
});
