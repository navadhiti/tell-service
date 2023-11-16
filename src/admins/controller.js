import QA_Model from './model.js';
import {
    successResponse,
    validationResponse,
    errorResponse,
} from '../utils/handleServerResponse.js';

const singleQA = async (req, res) => {
    const { question, answer, department, updatedBy } = req.body;

    try {
        const newQuestion = new QA_Model({
            question: question,
            answer: answer,
            department: department,
            createdBy: res.locals.decodedToken.name,
            updatedBy: updatedBy,
        });

        const response = await newQuestion.save();

        const responseData = successResponse(response);
        return res.status(200).json(responseData);
    } catch (error) {
        const responseData = errorResponse(400, error);
        return res.status(200).json(responseData);
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
            const responseData = successResponse(dataObject);
            return res.status(200).json(responseData);
        }
        const responseData = validationResponse('You have completed your session.');
        return res.status(200).json(responseData);
    } catch (error) {
        const responseData = errorResponse(400, error);
        return res.status(200).json(responseData);
    }
};

export { singleQA, getAllQA };
