import express from 'express';
import { singleQA } from './controller.js';
import verifyToken from '../middlewares/token.js';
import authUser from '../middlewares/auth.js';

const router = express.Router();

router.post('/singleQA', verifyToken, authUser, singleQA);
// router.post('/bulkQA', bulkQA);

export default router;
