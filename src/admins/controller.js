import QA_Model from './model.js';
import { successResponse, validationResponse } from '../utils/handleServerResponse.js';
import globalErrorHandler from '../utils/globalErrorHandler.js';

const singleQA = async (req, res) => {
    const { question, answer, department, updatedBy } = req.body;

    try {
        const newQuestion = new QA_Model({
            question: question,
            answer: answer,
            department: department,
            createdBy: res.locals.decodedToken.payload.name,
            updatedBy: updatedBy,
        });

        const data = await newQuestion.save();

        const responseData = successResponse('New Question Added Successfully.', data);
        return res.status(200).json(responseData);
    } catch (error) {
        globalErrorHandler(res, error);
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
            const responseData = successResponse(
                'Questions & Answers Retrieved Successfully.',
                dataObject
            );
            return res.status(200).json(responseData);
        }
        const responseData = validationResponse('You have completed your session.');
        return res.status(200).json(responseData);
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

export { singleQA, getAllQA };
