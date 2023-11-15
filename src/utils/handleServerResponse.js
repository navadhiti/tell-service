import { uid } from 'uid';

const successResponse = (responseMessage) => {
    return {
        result: 'Success',
        responseObj: {
            responseId: uid(16),
            responseTs: `${Math.floor(Date.now() / 1000)}`,
            responseApiVersion: 'v1',
            responseCode: 200,
            responseMessage: 'successfully done',
            responseDataParams: {
                data: responseMessage,
            },
        },
    };
};

const validationResponse = (validaitonMessage) => {
    return {
        result: 'Validaiton',
        responseObj: {
            responseId: uid(16),
            responseTs: `${Math.floor(Date.now() / 1000)}`,
            responseApiVersion: 'v1',
            responseCode: 400,
            responseMessage: 'Error in request format',
            responseDataParams: {
                data: validaitonMessage,
            },
        },
    };
};

const errorResponse = (errorMessage) => {
    return {
        result: 'Error',
        responseObj: {
            responseId: uid(16),
            responseTs: `${Math.floor(Date.now() / 1000)}`,
            responseApiVersion: 'v1',
            responseCode: 401,
            responseMessage: 'Error in Process',
            responseDataParams: {
                data: errorMessage,
            },
        },
    };
};

export { successResponse, validationResponse, errorResponse };
