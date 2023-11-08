import express from 'express';
import userRoutes from './users/routes.js';
import adminRoutes from './admins/routes.js';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/admin', adminRoutes);

export default router;
