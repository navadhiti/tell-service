/*
 * Run the project and access the documentation at: http://localhost:3000/user/doc & http://localhost:3000/admin/doc
 *
 * Use the command below to generate the documentation without starting the project:
 * $ npm run start
 *
 * Use the command below to generate the documentation at project startup:
 * $ npm run swagger
 */

import express from 'express';
import cors from 'cors';
import doDBConnect from './doDBConnect.js';
import router from './routes.js';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';

const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const swaggerDocumentUser = loadJSON('./utils/swagger-output-user.json');
const swaggerDocumentAdmin = loadJSON('./utils/swagger-output-admin.json');

doDBConnect();

const app = express();

app.use(express.json({ limit: '4mb' }));
app.use(cors());

app.use('/api/v1', router);

const useSchema = (schema) => (req, res, next) => {
    swaggerUi.setup(schema)(req, res, next);
};

app.use('/user/doc', swaggerUi.serve, useSchema(swaggerDocumentUser));
app.use('/admin/doc', swaggerUi.serve, useSchema(swaggerDocumentAdmin));

const port = process.env.PORT;
app.listen(port);
