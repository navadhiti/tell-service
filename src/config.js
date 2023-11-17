import dotenv from 'dotenv';
dotenv.config();

const { PORT, MONGODB_URL, JWT_SIGNIN_PRIVATE_KEY, JWT_ENCRYPTION_PRIVATE_KEY } = process.env;

export { PORT, MONGODB_URL, JWT_SIGNIN_PRIVATE_KEY, JWT_ENCRYPTION_PRIVATE_KEY };
