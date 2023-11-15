import handlePasswordEncrypt from '../utils/handlePasswordEncrypt.js';
import bcrypt from 'bcryptjs';
import { JWT_PRIVATE_KEY } from '../config.js';
import jwt from 'jsonwebtoken';
import userModel from './model.js';
import {
    successResponse,
    validationResponse,
    errorResponse,
} from '../utils/handleServerResponse.js';

const register = async (req, res) => {
    const { fullName, email, phoneNo, password } = req.body;

    if (password == undefined) {
        const responseData = validationResponse('Password field is required.');
        return res.status(400).json(responseData);
    }
    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,12}$/.test(password)) {
        const responseData = validationResponse(
            'Invalid Password. It must be 8-12 characters long and contain only valid characters: letters, numbers, @, $, !, %, *, ?, or &'
        );
        return res.status(400).json(responseData);
    }
    try {
        const user = await userModel.findOne({ email: email });

        if (user) {
            const responseData = errorResponse(
                'Account Already Exists. Please Login before SignUp'
            );
            return res.status(401).json(responseData);
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

            const responseMessage = response.toObject();
            responseMessage.password = password;
            responseMessage.token = token;

            const responseData = successResponse(responseMessage);
            return res.status(200).json(responseData);
        }
    } catch (error) {
        const responseData = errorResponse(error);
        return res.status(400).json(responseData);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const responseData = validationResponse(
            `${!email ? 'Email' : 'Password'} field is required.`
        );
        return res.status(400).json(responseData);
    }

    try {
        const user = await userModel.findOne({ email: email });

        if (!user) {
            const responseData = errorResponse('Account Not Exists. Please SignUp before Login');
            return res.status(401).json(responseData);
        } else {
            const passwordMatchResult = bcrypt.compareSync(password, user.password);

            if (!passwordMatchResult) {
                const responseData = errorResponse('Incorrect Username or Password');
                return res.status(401).json(responseData);
            } else {
                const jwtSecretKey = JWT_PRIVATE_KEY;
                const token = jwt.sign(
                    { email: email, name: user.fullName, isAdmin: user.isAdmin },
                    jwtSecretKey,
                    {
                        expiresIn: '10h',
                    }
                );

                const responseMessage = {
                    email: email,
                    password: password,
                    token: token,
                };

                const responseData = successResponse(responseMessage);
                return res.status(200).json(responseData);
            }
        }
    } catch (error) {
        const responseData = errorResponse(error);
        return res.status(400).json(responseData);
    }
};

const logout = async (req, res) => {
    if (res.locals.decodedToken) {
        const responseData = successResponse('Logged out Successful.');
        return res.status(200).json(responseData);
    }
    const responseData = errorResponse('Invalid token');
    return res.status(401).json(responseData);
};

export { register, login, logout };
