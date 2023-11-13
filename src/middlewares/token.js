import jwt from 'jsonwebtoken';
import { JWT_PRIVATE_KEY } from '../config.js';
import { warningResponse, errorResponse } from '../utils/handleServerResponse.js';

const verifyToken = (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        
        const jwtSecretKey = JWT_PRIVATE_KEY;
        const response = jwt.verify(token, jwtSecretKey);

        const currentTime = Math.floor(Date.now() / 1000);
        const expirationTime = response.exp;

        if (expirationTime <= currentTime)
            return warningResponse(res, 401, 'Unauthorized', 'Invalid Token.');
        res.locals.userRole = response.isAdmin;
        res.locals.userName = response.name;
        next()
    } catch (error) {
        return errorResponse(res, error);
    }
};

export default verifyToken;
