import { errorResponse } from '../utils/handleServerResponse.js';

const authUser = (req, res, next) => {
    if (res.locals.decodedToken.payload.isAdmin == false) {
        const responseData = errorResponse(401, 'Unauthorized Access to the user.');
        return res.status(200).json(responseData);
    }
    next();
};

export default authUser;
