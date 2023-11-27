import handlePasswordEncrypt from '../utils/handlePasswordEncrypt.js';
import bcrypt from 'bcryptjs';
import { JWT_SIGNIN_PRIVATE_KEY, JWT_ENCRYPTION_PRIVATE_KEY } from '../config.js';
import * as jose from 'jose';
import mongoose from 'mongoose';
import { userModel, QA_ResultModel } from './model.js';
import QA_Model from '../admins/model.js';
import {
    registerValidationSchema,
    loginValidationSchema,
    markResutValidationSchema,
} from '../users/validation.js';
import {
    successResponse,
    validationResponse,
    errorResponse,
} from '../utils/handleServerResponse.js';
import globalErrorHandler from '../utils/globalErrorHandler.js';

const register = async (req, res) => {
    const { fullName, email, phoneNumber, password } = req.body;

    const { error } = registerValidationSchema.validate(req.body);
    if (error) {
        const responseData = validationResponse(error.message);
        return res.status(200).json(responseData);
    }

    try {
        const user = await userModel.findOne({ email: email });

        if (user) {
            const responseData = errorResponse(409, 'Account Already Exists');
            return res.status(200).json(responseData);
        } else {
            const hashedPassword = await handlePasswordEncrypt(password);

            const newEmployee = new userModel({
                fullName: fullName,
                email: email,
                phoneNumber: phoneNumber,
                password: hashedPassword,
            });
            const response = await newEmployee.save();

            const jwtSigninKey = new TextEncoder().encode(JWT_SIGNIN_PRIVATE_KEY);
            const jwtSignedToken = await new jose.SignJWT({
                email: email,
                name: response.fullName,
                isAdmin: response.isAdmin,
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setExpirationTime('48h')
                .sign(jwtSigninKey);

            const jwtEncryptionKey = jose.base64url.decode(JWT_ENCRYPTION_PRIVATE_KEY);
            const jwtEncryptedToken = await new jose.EncryptJWT({ jwtSignedToken })
                .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
                .setExpirationTime('48h')
                .encrypt(jwtEncryptionKey);

            const data = response.toObject();
            data.password = password;
            data.token = jwtEncryptedToken;

            const responseData = successResponse('Registered Successfully', data);
            return res.status(200).json(responseData);
        }
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const { error } = loginValidationSchema.validate(req.body);
    if (error) {
        const responseData = validationResponse('Invalid Email or Password');
        return res.status(200).json(responseData);
    }

    try {
        const user = await userModel.findOne({ email: email });

        if (!user) {
            const responseData = errorResponse(404, 'Account Not Exists');
            return res.status(200).json(responseData);
        } else {
            const passwordMatchResult = bcrypt.compareSync(password, user.password);

            if (!passwordMatchResult) {
                const responseData = errorResponse(401, 'Incorrect Email or Password');
                return res.status(200).json(responseData);
            } else {
                const jwtSigninKey = new TextEncoder().encode(JWT_SIGNIN_PRIVATE_KEY);
                const jwtSignedToken = await new jose.SignJWT({
                    email: email,
                    name: user.fullName,
                    isAdmin: user.isAdmin,
                })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setExpirationTime('48h')
                    .sign(jwtSigninKey);

                const jwtEncryptionKey = jose.base64url.decode(JWT_ENCRYPTION_PRIVATE_KEY);
                const jwtEncryptedToken = await new jose.EncryptJWT({ jwtSignedToken })
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

const markResult = async (req, res) => {
    const dataFromRequest = req.body;

    const { error } = markResutValidationSchema.validate(req.body);
    if (error) {
        const responseData = validationResponse(error.message);
        return res.status(200).json(responseData);
    }

    try {
        const email = res.locals.decodedToken.payload.email;
        const user = await userModel.findOne({ email: email });

        const question = await QA_Model.find();
        const dataFromRequestObjectId = new mongoose.Types.ObjectId(dataFromRequest.QA_ID);
        const questionAvailable = await QA_Model.find({ _id: dataFromRequestObjectId });
        const index = question.findIndex((data) => data._id.equals(dataFromRequestObjectId));
        const result = await QA_ResultModel.findOne({
            QA_ID: dataFromRequestObjectId,
            User_ID: user._id,
        });

        if (questionAvailable.length === 0) {
            const responseData = errorResponse(404, 'Question Not Found');
            return res.status(200).json(responseData);
        } else if (!result && questionAvailable.length !== 0) {
            dataFromRequest.User_ID = user._id;
            const newResult = new QA_ResultModel(dataFromRequest);
            const response = await newResult.save();

            if (!(question.length == index + 1)) {
                const responseData = successResponse('Result Submitted Successfully', response);
                return res.status(200).json(responseData);
            }
        } else {
            const responseData = errorResponse(409, 'Result Already Submitted');
            return res.status(200).json(responseData);
        }

        if (question.length == index + 1) {
            const userResult = await QA_ResultModel.find({ User_ID: user._id });

            let sum = 0;
            userResult.map((data) => {
                sum = sum + (parseInt(data.questionMark) + parseInt(data.answerMark));
            });
            const mark = Math.floor(sum / (userResult.length * 2));

            if (mark < 50) {
                userResult.map(async (data) => {
                    await QA_ResultModel.deleteOne({ _id: data._id });
                });
            }

            const data = {
                userName: user.fullName,
                mark: mark,
                level: userResult[0].level,
            };
            const responseData = successResponse('Level Completed', data);
            return res.status(200).json(responseData);
        }
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

const logout = async (req, res) => {
    try {
        if (res.locals.decodedToken) {
            const responseData = successResponse('Logged out Successful', null);
            return res.status(200).json(responseData);
        } else {
            const responseData = errorResponse(500, 'Something went Wrong');
            return res.status(500).json(responseData);
        }
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

export { register, login, markResult, logout };
