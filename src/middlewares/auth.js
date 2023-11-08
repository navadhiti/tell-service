import { warningResponse, errorResponse } from '../utils/handleServerResponse.js';

const authUser = (req, res, next) => {
    if (res.locals.userRole !== false) {
        return warningResponse(
            res,
            401,
            'Unauthorized',
            'Access Denied.'
        );
    }
    next();
};

export default authUser;
