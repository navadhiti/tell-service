import express from 'express';
import userRoutes from './users/routes.js';

const router = express.Router();

router.use('/user', userRoutes);

export default router;
