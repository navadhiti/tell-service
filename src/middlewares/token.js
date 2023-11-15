import jwt from 'jsonwebtoken';
import { JWT_PRIVATE_KEY } from '../config.js';
import { errorResponse } from '../utils/handleServerResponse.js';

const verifyToken = (req, res, next) => {
    try {
        const token = req.header('x-auth-token');

        const jwtSecretKey = JWT_PRIVATE_KEY;
        const response = jwt.verify(token, jwtSecretKey);

        const currentTime = Math.floor(Date.now() / 1000);
        const expirationTime = response.exp;

        if (expirationTime <= currentTime) {
            const responseData = errorResponse('Invalid Token.');
            return res.status(401).json(responseData);
        }
        res.locals.decodedToken = response;
        next();
    } catch (error) {
        const responseData = errorResponse(error);
        return res.status(400).json(responseData);
    }
};

export default verifyToken;
