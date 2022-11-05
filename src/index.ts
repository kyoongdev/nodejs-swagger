import express from 'express';
import 'reflect-metadata';
import { SwaggerApplication } from 'swagger';
import { Test } from './example';
const app = express();

const swaggerApplication = new SwaggerApplication(app);
swaggerApplication.initSwagger([Test]);

app.listen(8000, () => {
  console.log('Server is running');
});
