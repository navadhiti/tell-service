import QA_Model from './model.js';
import { QA_ValidationSchema, indexSchema } from '../admins/validation.js';
import { successResponse, validationResponse } from '../utils/handleServerResponse.js';
import globalErrorHandler from '../utils/globalErrorHandler.js';

const singleQA = async (req, res) => {
    const { question, answer, department, updatedBy } = req.body;

    const { error } = QA_ValidationSchema.validate({
        question,
        answer,
        department,
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
            createdBy: res.locals.decodedToken.payload.name,
            updatedBy: updatedBy,
        });
        console.log(newQuestion.department.length);
        console.log(newQuestion.department.length > 0);

        const data = await newQuestion.save();

        const responseData = successResponse('New Question Added Successfully.', data);
        return res.status(200).json(responseData);
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

const getQA = async (req, res) => {
    const index = req.query.index;
    
    const indexError = index === undefined || index === '' ? 'Index parameter is required or Value must be a non-empty.' : null;
    const { error } = indexSchema.validate(parseInt(index));
    if (error || indexError) {
        const responseData = validationResponse(indexError ? indexError: error.message);
        return res.status(200).json(responseData);
    }

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

export { singleQA, getQA };
