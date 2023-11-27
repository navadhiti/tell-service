import logger from './utils/handleServerLog.js';
import mongoose from 'mongoose';
import { MONGODB_URL } from './config.js';
const url = MONGODB_URL;

const doDBConnect = async () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
    };

    try {
        await mongoose.connect(url, options);
        logger.log('info', 'Database connected');
    } catch (error) {
        logger.log('error', 'Database connection Error:', error);
    }
};

export default doDBConnect;
