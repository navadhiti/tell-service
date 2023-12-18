import { userModel } from '../users/model.js';
import { DepartmentModel, QA_Model } from './model.js';
import {
    QA_PostValidationSchema,
    QA_GetValidationSchema,
    post_updateDepartmentSchema,
} from '../admins/validation.js';
import { successResponse, validationResponse } from '../utils/handleServerResponse.js';
import globalErrorHandler from '../utils/globalErrorHandler.js';

const singleQA = async (req, res) => {
    const { question, answer, department, level, scenario, updatedBy } = req.body;

    const { error } = QA_PostValidationSchema.validate({
        question,
        answer,
        department,
        level,
        scenario,
        createdBy: res.locals.decodedToken.payload.name,
    });
    if (error) {
        const responseData = validationResponse(error.message);
        return res.status(400).json(responseData);
    }

    try {
        const newQuestion = new QA_Model({
            question: question,
            answer: answer,
            department: department,
            level: level,
            scenario: scenario,
            createdBy: res.locals.decodedToken.payload.name,
            updatedBy: updatedBy,
        });

        const data = await newQuestion.save();

        const responseData = successResponse('New Question Added Successfully', data);
        return res.status(200).json(responseData);
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

const getQA = async (req, res) => {
    const { scenario, index } = req.query;

    const { error } = QA_GetValidationSchema.validate({ scenario, index });
    if (error) {
        const responseData = validationResponse(error.message);
        return res.status(200).json(responseData);
    }

    const email = res.locals.decodedToken.payload.email;
    const user = await userModel.findOne({ email: email });
    const level = user.level === undefined ? 1 : user.level;

    function isDecimal(number) {
        return number % 1 !== 0;
    }

    try {
        const response = await QA_Model.find({
            department: 'Generic',
            level: level,
            scenario: scenario,
        });

        if (response.length >= index) {
            const approximateInteger = Math.round(index);

            const data = response.slice(approximateInteger - 1, approximateInteger);
            const dataObject = data[0].toObject();
            dataObject.totalQuestions = response.length;

            const finalIndex = parseFloat(index);

            if (isDecimal(finalIndex)) {
                const responseData = successResponse('Question & Answer Retrieved Successfully', {
                    _id: dataObject._id,
                    question: dataObject.question,
                    department: dataObject.department,
                    level: dataObject.level,
                    scenario: dataObject.scenario,
                    createdBy: dataObject.createdBy,
                    __v: dataObject.__v,
                    totalQuestions: dataObject.totalQuestions,
                });
                return res.status(200).json(responseData);
            } else {
                const responseData = successResponse('Question & Answer Retrieved Successfully', {
                    _id: dataObject._id,
                    question: dataObject.question,
                    answer: dataObject.answer,
                    department: dataObject.department,
                    level: dataObject.level,
                    scenario: dataObject.scenario,
                    createdBy: dataObject.createdBy,
                    __v: dataObject.__v,
                    totalQuestions: dataObject.totalQuestions,
                });
                return res.status(200).json(responseData);
            }
        }
        const responseData = validationResponse('You have completed your session');
        return res.status(200).json(responseData);
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

const postDepartment = async (req, res) => {
    const { department } = req.body;

    const { error } = post_updateDepartmentSchema.validate({ department });
    if (error) {
        const responseData = validationResponse(error.message);
        return res.status(200).json(responseData);
    }

    try {
        const departmentField = await DepartmentModel.find();
        if (departmentField.length === 0) {
            const newDepartment = new DepartmentModel({
                department: department,
            });

            const data = await newDepartment.save();
            const responseData = successResponse('New Department Added Successfully', data);
            return res.status(200).json(responseData);
        } else {
            const promises = department.map(async (dep) => {
                const existingDepartment = await DepartmentModel.findOne({
                    department: { $in: [dep] },
                });
                if (!existingDepartment) {
                    await DepartmentModel.updateOne({ $push: { department: dep } });
                }
            });
            await Promise.all(promises);
            const responseData = successResponse(
                'New Department Added Successfully',
                await DepartmentModel.find()
            );
            return res.status(200).json(responseData);
        }
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

const getDepartment = async (req, res) => {
    try {
        const data = await DepartmentModel.find();
        const responseData = successResponse(
            'All Departments Retrieved Successfully',
            data[0].department
        );
        return res.status(200).json(responseData);
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

const updateUserDepartment = async (req, res) => {
    const { department } = req.body;

    const { error } = post_updateDepartmentSchema.validate({ department });
    if (error) {
        const responseData = validationResponse(error.message);
        return res.status(200).json(responseData);
    }

    const filter = {
        email: res.locals.decodedToken.payload.email,
    };
    const update = {
        $set: { department: department },
    };
    const options = {
        new: true,
    };

    const updatedUserDetails = await userModel.findOneAndUpdate(filter, update, options);

    const responseData = successResponse(
        'New Department Selected Successfully',
        updatedUserDetails.department
    );
    return res.status(200).json(responseData);
};

const getUserDepartment = async (req, res) => {
    try {
        const data = await userModel.findOne({ email: res.locals.decodedToken.payload.email });
        const responseData = successResponse(
            'All Departments Retrieved Successfully',
            data.department
        );
        return res.status(200).json(responseData);
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

export { singleQA, getQA, postDepartment, getDepartment, updateUserDepartment, getUserDepartment };
