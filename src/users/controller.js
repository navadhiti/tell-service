import handlePasswordEncrypt from '../utils/handlePasswordEncrypt.js';
import bcrypt from 'bcryptjs';
import { JWT_SIGNIN_PRIVATE_KEY, JWT_ENCRYPTION_PRIVATE_KEY } from '../config.js';
import * as jose from 'jose';
import mongoose from 'mongoose';
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
        scenario,
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
        scenario,
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
        const department = 'Generic';

        const questions = await QA_Model.find({
            department: department,
            level: level,
            scenario: scenario,
        });
        const foundQA = questions.find((data) =>
            data._id.equals(new mongoose.Types.ObjectId(QA_ID))
        );

        if (!foundQA) {
            const responseData = errorResponse(404, 'Question Not Found');
            return res.status(200).json(responseData);
        } else if (userResult === null) {
            const newResult = new QA_ResultModel({
                user_ID: user._id,
                attempt: {
                    [department]: {
                        [`Level ${level}`]: {
                            [scenario]: [[req.body]],
                        },
                    },
                },
            });

            const data = await newResult.save();

            const responseData = successResponse(
                'Result Submitted Successfully',
                data.attempt[department][`Level ${level}`][scenario][0][0]
            );
            return res.status(200).json(responseData);
        } else if (Object.keys(userResult.attempt).findIndex((key) => key === department) === -1) {
            userResult.set(`attempt.${department}.Level ${level}.${scenario}`, []);
            await userResult.save();

            const filter = {
                user_ID: user._id,
            };
            const update = {
                $push: {
                    [`attempt.${department}.Level ${level}.${scenario}`]: [req.body],
                },
            };
            const options = {
                new: true,
            };

            const updatedUserResult = await QA_ResultModel.findOneAndUpdate(
                filter,
                update,
                options
            );
            const data = await updatedUserResult.save();

            const responseData = successResponse(
                'Result Submitted Successfully',
                data.attempt[department][`Level ${level}`][scenario][0][0]
            );
            return res.status(200).json(responseData);
        } else if (
            Object.keys(userResult.attempt[department]).findIndex(
                (key) => key === `Level ${level}`
            ) === -1
        ) {
            userResult.set(`attempt.${department}.Level ${level}.${scenario}`, []);
            await userResult.save();

            const filter = {
                user_ID: user._id,
            };
            const update = {
                $push: {
                    [`attempt.${department}.Level ${level}.${scenario}`]: [req.body],
                },
            };
            const options = {
                new: true,
            };

            const updatedUserResult = await QA_ResultModel.findOneAndUpdate(
                filter,
                update,
                options
            );
            const data = await updatedUserResult.save();

            const responseData = successResponse(
                'Result Submitted Successfully',
                data.attempt[department][`Level ${level}`][scenario][0][0]
            );
            return res.status(200).json(responseData);
        } else if (
            Object.keys(userResult.attempt[department][`Level ${level}`]).findIndex(
                (key) => key === scenario
            ) === -1
        ) {
            userResult.set(`attempt.${department}.Level ${level}.${scenario}`, []);
            await userResult.save();

            const filter = {
                user_ID: user._id,
            };
            const update = {
                $push: {
                    [`attempt.${department}.Level ${level}.${scenario}`]: [req.body],
                },
            };
            const options = {
                new: true,
            };

            const updatedUserResult = await QA_ResultModel.findOneAndUpdate(
                filter,
                update,
                options
            );
            const data = await updatedUserResult.save();

            const responseData = successResponse(
                'Result Submitted Successfully',
                data.attempt[department][`Level ${level}`][scenario][0][0]
            );
            return res.status(200).json(responseData);
        } else {
            let isResultPresent = false;

            for (
                let i = 0;
                i < userResult.attempt[department][`Level ${level}`][scenario].length;
                i++
            ) {
                const indexToUpdate = userResult.attempt[department][`Level ${level}`][scenario][
                    i
                ].findIndex((item) => item.QA_ID === QA_ID);
                if (
                    indexToUpdate === -1 &&
                    i === userResult.attempt[department][`Level ${level}`][scenario].length - 1
                ) {
                    const filter = {
                        user_ID: user._id,
                    };
                    const update = {
                        $push: {
                            [`attempt.${department}.Level ${level}.${scenario}.${[i]}`]: req.body,
                        },
                    };
                    const options = {
                        new: true,
                    };

                    const updatedUserResult = await QA_ResultModel.findOneAndUpdate(
                        filter,
                        update,
                        options
                    );

                    isResultPresent = true;

                    const isLengthEqual =
                        updatedUserResult.attempt[department][`Level ${level}`][scenario][i]
                            .length === questions.length;

                    let QA_length = 0;
                    const levelData = updatedUserResult.attempt[department][`Level ${level}`];
                    Object.keys(levelData).forEach((key) => {
                        const lastArray = levelData[key][levelData[key].length - 1];
                        QA_length = QA_length + lastArray.length;
                    });

                    const questions1 = await QA_Model.find({
                        department: department,
                        level: level,
                    });

                    if (questions1.length === QA_length) {
                        let mark = 0;
                        let speed = 0;
                        let seconds = 0;

                        Object.keys(levelData).forEach((key) => {
                            const lastArray1 = levelData[key][levelData[key].length - 1];
                            lastArray1.map((data) => {
                                mark = mark + data.questionMark + data.answerMark;
                                speed =
                                    speed +
                                    ((data.questionResult.split(' ').length /
                                        data.timeTakenForQuestion) *
                                        60 +
                                        (data.questionResult.split(' ').length /
                                            data.timeTakenForAnswer) *
                                            60);
                                seconds =
                                    seconds + data.timeTakenForQuestion + data.timeTakenForAnswer;
                            });
                        });

                        const finalMark = Math.floor(mark / (QA_length * 2));

                        const totalSpeed = Math.floor((speed / seconds) * 60);

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
                            level: level,
                            mark: finalMark,
                            speed: finalSpeed,
                        };

                        if (finalMark >= 50) {
                            await userModel.updateOne(
                                { _id: user._id },
                                { $set: { level: level + 1 } }
                            );
                        }

                        const responseData = successResponse(`Level-${level} Completed`, data);
                        return res.status(200).json(responseData);
                    } else if (isLengthEqual) {
                        const responseData = successResponse(
                            'Result Submitted Successfully',
                            updatedUserResult.attempt[department][`Level ${level}`][scenario][i][
                                updatedUserResult.attempt[department][`Level ${level}`][scenario][i]
                                    .length - 1
                            ]
                        );
                        return res.status(200).json(responseData);
                    } else {
                        const responseData = successResponse(
                            'Result Submitted Successfully',
                            updatedUserResult.attempt[department][`Level ${level}`][scenario][i][
                                updatedUserResult.attempt[department][`Level ${level}`][scenario][i]
                                    .length - 1
                            ]
                        );
                        return res.status(200).json(responseData);
                    }
                }
            }
            if (!isResultPresent) {
                const newIndex = userResult.attempt[department][`Level ${level}`][scenario].length;

                const filter = {
                    user_ID: user._id,
                };
                const update = {
                    $push: {
                        [`attempt.${department}.Level ${level}.${scenario}.${[newIndex]}`]:
                            req.body,
                    },
                };
                const options = {
                    new: true,
                };

                const data = await QA_ResultModel.findOneAndUpdate(filter, update, options);

                const responseData = successResponse(
                    'Result Submitted Successfully',
                    data.attempt[department][`Level ${level}`][scenario][newIndex][0]
                );
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
