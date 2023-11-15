import { errorResponse } from '../utils/handleServerResponse.js';

const authUser = (req, res, next) => {
    if (res.locals.decodedToken.isAdmin == false) {
        const responseData = errorResponse('Access Denied.');
        return res.status(400).json(responseData);
    }
    next();
};

export default authUser;
