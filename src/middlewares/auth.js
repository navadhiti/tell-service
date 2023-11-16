import { errorResponse } from '../utils/handleServerResponse.js';

const authUser = (req, res, next) => {
    if (res.locals.decodedToken.isAdmin == false) {
        const responseData = errorResponse(401, 'Access Denied.');
        return res.status(200).json(responseData);
    }
    next();
};

export default authUser;
