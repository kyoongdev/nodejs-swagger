import express from 'express';
import 'reflect-metadata';
import { SwaggerApplication } from 'swagger';
import { Test, Test2 } from './example';
const app = express();

const swaggerApplication = new SwaggerApplication(app);
swaggerApplication.initSwagger([Test, Test2]);

app.listen(8000, () => {
  console.log('Server is running');
});
