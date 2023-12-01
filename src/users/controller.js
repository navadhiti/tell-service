import handlePasswordEncrypt from '../utils/handlePasswordEncrypt.js';
import bcrypt from 'bcryptjs';
import { JWT_SIGNIN_PRIVATE_KEY, JWT_ENCRYPTION_PRIVATE_KEY } from '../config.js';
import * as jose from 'jose';
import { userModel, QA_ResultModel } from './model.js';
import { QA_Model } from '../admins/model.js';

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
    const {
        QA_ID,
        questionResult,
        answerResult,
        questionMark,
        answerMark,
        level,
        timeTakenForQuestion,
        timeTakenForAnswer,
    } = req.body;

    const { error } = markResutValidationSchema.validate({
        QA_ID,
        questionResult,
        answerResult,
        questionMark,
        answerMark,
        level,
        timeTakenForQuestion,
        timeTakenForAnswer,
    });
    if (error) {
        const responseData = validationResponse(error.message);
        return res.status(200).json(responseData);
    }

    try {
        const email = res.locals.decodedToken.payload.email;
        const user = await userModel.findOne({ email: email });
        const userResult = await QA_ResultModel.findOne({ user_ID: user._id });
        const questions = await QA_Model.find({
            level: level,
            department: { $in: user.department },
        });

        if (userResult === null) {
            const newResult = new QA_ResultModel({
                user_ID: user._id,
                attempt: [[req.body]],
            });
            const data = await newResult.save();

            const responseData = successResponse('Result Submitted Successfully', data);
            return res.status(200).json(responseData);
        } else {
            let isResultPresent = false;

            for (let i = 0; i < userResult.attempt.length; i++) {
                const indexToUpdate = userResult.attempt[i].findIndex(
                    (item) => item.QA_ID === QA_ID
                );
                if (indexToUpdate === -1 && i === userResult.attempt.length - 1) {
                    userResult.attempt[i].push(req.body);
                    isResultPresent = true;
                    break;
                }
            }
            if (!isResultPresent) {
                const newIndex = userResult.attempt.length;
                userResult.attempt[newIndex] = [req.body];
            }
        }

        const data = await userResult.save();
        const updatedUserResult = await QA_ResultModel.findOne({ user_ID: user._id });
        const attemptArrayLength = updatedUserResult.attempt.length;

        const isLengthEqual =
            updatedUserResult.attempt[attemptArrayLength - 1].length === questions.length;

        if (isLengthEqual) {
            let mark = 0;
            let speed = 0;
            updatedUserResult.attempt[attemptArrayLength - 1].map(async (data) => {
                mark = mark + data.questionMark + data.answerMark;
                speed =
                    speed +
                    ((data.questionResult.split(' ').length / data.timeTakenForQuestion) * 60 +
                        (data.questionResult.split(' ').length / data.timeTakenForAnswer) * 60) /
                        2;
            });

            const finalMark = Math.floor(
                mark / (updatedUserResult.attempt[attemptArrayLength - 1].length * 2)
            );

            const totalSpeed = Math.floor(
                speed / updatedUserResult.attempt[attemptArrayLength - 1].length
            );

            let finalSpeed;

            if (totalSpeed < 100) {
                finalSpeed = 'Slow';
            } else if (totalSpeed >= 100 && totalSpeed <= 140) {
                finalSpeed = 'Medium';
            } else {
                finalSpeed = 'Fast';
            }

            const data = {
                userName: user.fullName,
                level: 'level 1',
                mark: finalMark,
                speed: finalSpeed,
            };
            const responseData = successResponse('Level Completed', data);
            return res.status(200).json(responseData);
        } else {
            const responseData = successResponse('Result Submitted Successfully', data);
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
