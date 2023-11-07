import dotenv from 'dotenv';
dotenv.config();

const { PORT, MONGODB_URL } = process.env;

export { PORT, MONGODB_URL };
