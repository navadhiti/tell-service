import express from 'express';
import { singleQA, getAllQA } from './controller.js';
import verifyToken from '../middlewares/token.js';
import authUser from '../middlewares/auth.js';

const router = express.Router();

router.post('/singleQA', verifyToken, authUser, singleQA);
router.get('/getAllQA', verifyToken, getAllQA);

export default router;
