import { validationResponse, errorResponse } from '../utils/handleServerResponse.js';

const globalErrorHandler = (res, error) => {
    if (error.name == 'ValidationError') {
        const responseData = validationResponse(error.message);
        return res.status(200).json(responseData);
    } else if (error.level == 'error') {
        const responseData = errorResponse(500, error.message);
        return res.status(200).json(responseData);
    }
    const responseData = errorResponse(400, error);
    return res.status(200).json(responseData);
};

export default globalErrorHandler;
