import handlePasswordEncrypt from '../utils/handlePasswordEncrypt.js';
import userModel from './model.js';
import { warningResponse, successResponse, errorResponse } from '../utils/handleServerResponse.js';

const register = async (req, res) => {
    const { fullName, email, phoneNo, password } = req.body;

    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,12}$/.test(password)) {
        return warningResponse(
            res,
            400,
            'BAD_REQUEST',
            'Invalid Password. It must be 8-12 characters long and contain only valid characters: letters, numbers, @, $, !, %, *, ?, or &'
        );
    }
    try {
        const user = await userModel.findOne({ email: email });

        if (user) {
            return warningResponse(
                res,
                409,
                'CONFLICT',
                'Account Already Exists. Please Login before SignUp'
            );
        } else {
            const hashedPassword = await handlePasswordEncrypt(password);

            const newEmployee = new userModel({
                fullName: fullName,
                email: email,
                phoneNo: phoneNo,
                password: hashedPassword,
            });

            await newEmployee.save();
            return successResponse(res, 200, 'OK', 'New User Added to the Database', req.body);
        }
    } catch (error) {
        return errorResponse(res, error);
    }
};

export { register };
