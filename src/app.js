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

import swaggerUi from 'swagger-ui-express';
import swaggerDocumentUser from './utils/swagger-output-user.json' assert { type: 'json' };
import swaggerDocumentAdmin from './utils/swagger-output-admin.json' assert { type: 'json' };

doDBConnect();

const app = express();

app.use(express.json({ limit: '4mb' }));
app.use(cors());

app.use('/api', router);

const useSchema = (schema) => (req, res, next) => {
    swaggerUi.setup(schema)(req, res, next);
};  

app.use('/user/doc', swaggerUi.serve, useSchema(swaggerDocumentUser));
app.use('/admin/doc', swaggerUi.serve, useSchema(swaggerDocumentAdmin));

const port = process.env.PORT;
app.listen(port);
