const warningResponse = (res, statusCode, code, message) => {
    res.status(statusCode).json({
        status: 'Error',
        code: code,
        statusCode: statusCode,
        message: message,
    });
};

const successResponse = (res, statusCode, code, message, data) => {
    res.status(statusCode).json({
        status: 'Success',
        code: code,
        statusCode, statusCode,
        message: message,
        data: data,
    });
};

const errorResponse = (res, error) => {
    res.status(400).json({
        status: 'Error',
        code: 400,
        error: error,
    });
};

export { warningResponse, successResponse, errorResponse };
