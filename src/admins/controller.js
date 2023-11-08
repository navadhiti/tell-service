import QA_Model from './model.js';
import { successResponse, warningResponse, errorResponse } from '../utils/handleServerResponse.js';

const singleQA = async (req, res) => {
    const { question, answer, department, updatedBy } = req.body;

    try {
        const newQuestion = new QA_Model({
            question: question,
            answer: answer,
            department: department,
            createdBy: res.locals.userName,
            updatedBy: updatedBy,
        });

        const response = await newQuestion.save();

        return successResponse(res, 200, 'OK', 'New Question Added to the Database', response);
    } catch (error) {
        return errorResponse(res, error);
    }
};

const getAllQA = async (req, res) => {
    const index = parseInt(req.query.index);
    try {
        const response = await QA_Model.find();
        if (response.length >= index && index !== 0) {
            const data = response.slice(index - 1, index);
            const dataObject = data[0].toObject();
            dataObject.totalQuestions = response.length;
            return successResponse(res, 200, 'OK', 'Question Retrieved Successfully.', dataObject);
        }
        return warningResponse(res, 422, 'Unprocessable Entity', 'You have completed your session');
    } catch (error) {
        return errorResponse(res, error);
    }
};

export { singleQA, getAllQA };
