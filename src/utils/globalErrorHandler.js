import { validationResponse, errorResponse } from '../utils/handleServerResponse.js';

const globalErrorHandler = (res, error) => {
    if (error.name == 'ValidationError') {
        const responseData = validationResponse(error.message);
        return res.status(200).json(responseData);
    } else if (
        error.code == 'ERR_JWE_DECRYPTION_FAILED' ||
        error.code == 'ERR_JWE_INVALID' ||
        error.code == 'ERR_JWT_EXPIRED'
    ) {
        const responseData = errorResponse(200, 'Invalid Token.');
        return res.status(200).json(responseData);
    } else {
        const responseData = errorResponse(400, error);
        return res.status(200).json(responseData);
    }
};

export default globalErrorHandler;
