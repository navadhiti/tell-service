import dotenv from 'dotenv';
dotenv.config();

const { PORT, MONGODB_URL, JWT_PRIVATE_KEY } = process.env;

export { PORT, MONGODB_URL, JWT_PRIVATE_KEY };
