import express from 'express';
import cors from 'cors';
import httpstatus from 'http-status';
import doDBConnect from './doDBConnect.js';
import router from './routes.js';

doDBConnect();

const { NOT_FOUND } = httpstatus;
const app = express();

app.use(express.json({ limit: '4mb' }));
app.use(cors());

app.use('/api', router);

app.use((req, res, next) => {
    next({ statusCode: NOT_FOUND, message: 'Not found' });
});

const port = process.env.PORT;
app.listen(port);
