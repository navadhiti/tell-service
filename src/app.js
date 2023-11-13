/*
 * Run the project and access the documentation at: http://localhost:3000/doc
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

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocumentAdmin))
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocumentUser))

const port = process.env.PORT;
app.listen(port);
