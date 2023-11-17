import handlePasswordEncrypt from '../utils/handlePasswordEncrypt.js';
import bcrypt from 'bcryptjs';
import { JWT_SIGNIN_PRIVATE_KEY, JWT_ENCRYPTION_PRIVATE_KEY } from '../config.js';
import * as jose from 'jose';
import userModel from './model.js';
import {
    successResponse,
    validationResponse,
    errorResponse,
} from '../utils/handleServerResponse.js';
import globalErrorHandler from '../utils/globalErrorHandler.js';

const register = async (req, res) => {
    const { fullName, email, phoneNo, password } = req.body;

    if (password == undefined) {
        const responseData = validationResponse('Password field is required.');
        return res.status(200).json(responseData);
    }
    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,12}$/.test(password)) {
        const responseData = validationResponse(
            'Invalid Password. It must be 8-12 characters long and contain only valid characters: letters, numbers, @, $, !, %, *, ?, or &'
        );
        return res.status(200).json(responseData);
    }

    try {
        const user = await userModel.findOne({ email: email });

        if (user) {
            const responseData = errorResponse(
                409,
                'Account Already Exists.'
            );
            return res.status(200).json(responseData);
        } else {
            const hashedPassword = await handlePasswordEncrypt(password);

            const newEmployee = new userModel({
                fullName: fullName,
                email: email,
                phoneNo: phoneNo,
                password: hashedPassword,
            });
            const response = await newEmployee.save();

            const jwtSigninKey = new TextEncoder().encode(JWT_SIGNIN_PRIVATE_KEY);
                const jwtSignedToken = await new jose.SignJWT({ email: email, name: response.fullName, isAdmin: response.isAdmin })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setExpirationTime('48h')
                    .sign(jwtSigninKey)

                const jwtEncryptionKey = jose.base64url.decode(JWT_ENCRYPTION_PRIVATE_KEY);
                const jwtEncryptedToken = await new jose.EncryptJWT({jwtSignedToken})
                    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
                    .setExpirationTime('48h')
                    .encrypt(jwtEncryptionKey);

            const data = response.toObject();
            data.password = password;
            data.token = jwtEncryptedToken;

            const responseData = successResponse('Register Successful', data);
            return res.status(200).json(responseData);
        }
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const responseData = validationResponse(
            `${!email ? 'Email' : 'Password'} field is required.`
        );
        return res.status(200).json(responseData);
    }

    if (!/^[a-z0-9]+(?:\.[a-z0-9]+)?@[a-z]+\.[a-z]{3}$/.test(email)) {
        const responseData = validationResponse(`Email is invalid`);
        return res.status(200).json(responseData);
    }

    try {
        const user = await userModel.findOne({ email: email });

        if (!user) {
            const responseData = errorResponse(404, 'Account Not Exists. Please SignUp before Login');
            return res.status(200).json(responseData);
        } else {
            const passwordMatchResult = bcrypt.compareSync(password, user.password);

            if (!passwordMatchResult) {
                const responseData = errorResponse(401, 'Incorrect Email or Password');
                return res.status(200).json(responseData);
            } else {
                const jwtSigninKey = new TextEncoder().encode(JWT_SIGNIN_PRIVATE_KEY);
                const jwtSignedToken = await new jose.SignJWT({ email: email, name: user.fullName, isAdmin: user.isAdmin })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setExpirationTime('48h')
                    .sign(jwtSigninKey)

                const jwtEncryptionKey = jose.base64url.decode(JWT_ENCRYPTION_PRIVATE_KEY);
                const jwtEncryptedToken = await new jose.EncryptJWT({jwtSignedToken})
                    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
                    .setExpirationTime('48h')
                    .encrypt(jwtEncryptionKey);

                const data = {
                    email: email,
                    password: password,
                    token: jwtEncryptedToken,
                };

                const responseData = successResponse('Login Successful', data);
                return res.status(200).json(responseData);
            }
        }
    } catch (error) {
        globalErrorHandler(res, error);

    }
};

const logout = async (req, res) => {
    try {
        if (res.locals.decodedToken) {
            const responseData = successResponse('Logged out Successful.', null);
            return res.status(200).json(responseData);
        }
        const responseData = errorResponse(401, 'Invalid token');
        return res.status(200).json(responseData);
    } catch (error) {
        globalErrorHandler(res, error);

    }
};

export { register, login, logout };
