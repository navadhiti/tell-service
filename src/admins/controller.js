import { userModel } from '../users/model.js';
import { DepartmentModel, QA_Model } from './model.js';
import {
    QA_PostValidationSchema,
    QA_GetValidationSchema,
    updateDepartmentSchema,
} from '../admins/validation.js';
import { successResponse, validationResponse } from '../utils/handleServerResponse.js';
import globalErrorHandler from '../utils/globalErrorHandler.js';

const singleQA = async (req, res) => {
    const { question, answer, department, level, updatedBy } = req.body;

    const { error } = QA_PostValidationSchema.validate({
        question,
        answer,
        department,
        level,
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
            createdBy: res.locals.decodedToken.payload.name,
            updatedBy: updatedBy,
        });

        const data = await newQuestion.save();

        const responseData = successResponse('New Question Added Successfully', data);
        return res.status(200).json(responseData);
    } catch (error) {
        globalErrorHandler(res, error);
    }
    getDepartment;
};

const getQA = async (req, res) => {
    const { index, level } = req.query;

    const { error } = QA_GetValidationSchema.validate({ index, level });
    if (error) {
        const responseData = validationResponse(error.message);
        return res.status(200).json(responseData);
    }

    const user = await userModel.findOne({ email: res.locals.decodedToken.payload.email });

    try {
        const response = await QA_Model.find({
            level: level,
            department: { $in: user.department },
        });

        if (response.length >= index) {
            //&& index !== 0
            const data = response.slice(index - 1, index);
            const dataObject = data[0].toObject();
            dataObject.totalQuestions = response.length;
            const responseData = successResponse(
                'Question & Answer Retrieved Successfully',
                dataObject
            );
            return res.status(200).json(responseData);
        }
        const responseData = validationResponse('You have completed your session');
        return res.status(200).json(responseData);
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

const postDepartment = async (req, res) => {
    const { department } = req.body;

    try {
        const departmentField = await DepartmentModel.find();
        if (departmentField.length === 0) {
            const newDepartment = new DepartmentModel({
                department: department,
            });

            const data = await newDepartment.save();
            const responseData = successResponse(
                'New Department Array Created & Values Added Successfully',
                data
            );
            return res.status(200).json(responseData);
        } else {
            department.map(async (dep) => {
                const existingDepartment = await DepartmentModel.findOne({
                    department: { $in: [dep] },
                });
                if (!existingDepartment) {
                    await DepartmentModel.updateOne({ $push: { department: dep } });
                }
            });
            const responseData = successResponse(
                'New Department Added Successfully in Existing Department Property',
                await DepartmentModel.find({ department })
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

    const { error } = updateDepartmentSchema.validate({ department });
    if (error) {
        const responseData = validationResponse(error.message);
        return res.status(200).json(responseData);
    }

    const user = await userModel.findOne({ email: res.locals.decodedToken.payload.email });
    const updatePromises = department.map(async (dep) => {
        const existingDepartment = await userModel.findOne({
            _id: user._id,
            department: { $in: [dep] },
        });
        if (!existingDepartment) {
            await user.updateOne({ $push: { department: dep } });
        }
    });
    await Promise.all(updatePromises);

    const updatedUserDetails = await userModel.findOne({
        email: res.locals.decodedToken.payload.email,
    });
    const responseData = successResponse(
        'New Department Added Successfully in Existing User Department Property',
        updatedUserDetails.department
    );
    return res.status(200).json(responseData);
};

export { singleQA, getQA, postDepartment, getDepartment, updateUserDepartment };
