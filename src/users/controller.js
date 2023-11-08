import handlePasswordEncrypt from '../utils/handlePasswordEncrypt.js';
import bcrypt from 'bcryptjs';
import { JWT_PRIVATE_KEY } from '../config.js';
import jwt from 'jsonwebtoken';
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

            const response = await newEmployee.save();

            const jwtSecretKey = JWT_PRIVATE_KEY;
            const token = jwt.sign({ email: email, name: fullName, isAdmin: false }, jwtSecretKey, {
                expiresIn: '10h',
            });

            const data = response.toObject();
            data.token = token;

            return successResponse(res, 200, 'OK', 'New User Added to the Database', data);
        }
    } catch (error) {
        return errorResponse(res, error);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return warningResponse(
                res,
                404,
                'NOT_FOUND',
                'Account Not Exists. Please SignUp before Login'
            );
        } else {
            const passwordMatchResult = bcrypt.compareSync(password, user.password);

            if (!passwordMatchResult) {
                return warningResponse(res, 401, 'UNAUTHORIZED', 'Incorrect Username or Password');
            } else {
                const jwtSecretKey = JWT_PRIVATE_KEY;
                const token = jwt.sign(
                    { email: email, name: user.fullName, isAdmin: user.isAdmin },
                    jwtSecretKey,
                    {
                        expiresIn: '10h',
                    }
                );

                const data = {
                    email: email,
                    password: password,
                    token: token,
                };
                return successResponse(res, 200, 'OK', 'Login Successful', data);
            }
        }
    } catch (error) {
        return errorResponse(res, error);
    }
};

export { register, login };
