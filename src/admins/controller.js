import QA_Model from './model.js';
import { QA_PostValidationSchema, QA_GetValidationSchema } from '../admins/validation.js';
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
};

const getQA = async (req, res) => {
    const { index, level, department } = req.query;

    if (department === undefined || department === '') {
        const responseData = validationResponse('department parameter is required');
        return res.status(200).json(responseData);
    }
    const departmentArray = JSON.parse(department.replace(/'/g, ''));
    const { error } = QA_GetValidationSchema.validate({ index, level, departmentArray });
    if (error) {
        const responseData = validationResponse(error.message);
        return res.status(200).json(responseData);
    }

    try {
        const response = await QA_Model.find({
            level: level,
            department: { $in: departmentArray },
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

export { singleQA, getQA };
