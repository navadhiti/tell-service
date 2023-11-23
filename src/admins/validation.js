import Joi from 'joi';

const question = Joi.string().trim().required().empty().messages({
    'any.required': 'Question field is required',
    'string.empty': 'Question is must be a non-empty',
});
const answer = Joi.string().trim().required().empty().messages({
    'any.required': 'Answer field is required',
    'string.empty': 'Answer is must be a non-empty',
});
const department = Joi.string().trim().required().empty().messages({
    'any.required': 'Department field is required',
    'string.empty': 'Department is must be a non-empty',
});
const createdBy = Joi.string().trim().required().empty().messages({
    'any.required': 'CreatedBy field is required',
    'string.empty': 'CreatedBy is must be a non-empty',
});

const QA_ValidationSchema = Joi.object({
    question: question,
    answer: answer,
    department: department,
    createdBy: createdBy,
});

const indexSchema = Joi.number().integer().min(1).required().messages({
    'number.base': 'Index must be a number',
    'number.min': 'Index must be greater than or equal to 1',
    'any.required': 'Index is required',
});

export { QA_ValidationSchema, indexSchema };
