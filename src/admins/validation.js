import Joi from 'joi';

const question = Joi.string().trim().required().empty().messages({
    'any.required': 'Question field is required',
    'string.empty': 'Question is must be a non-empty',
});
const answer = Joi.string().trim().required().empty().messages({
    'any.required': 'Answer field is required',
    'string.empty': 'Answer is must be a non-empty',
});
const department = Joi.array()
    .items(
        Joi.string().trim().required().empty().messages({
            'string.empty': 'Department Name must be a non-empty string',
        })
    )
    .required()
    .messages({
        'any.required': 'Department field is required',
        'array.base': 'Department must be an array',
        'array.empty': 'Department must be a non-empty array',
    });
const level = Joi.number().integer().min(1).required().messages({
    'number.base': 'Level must be a number',
    'number.min': 'Level must be greater than or equal to 1',
    'any.required': 'Level parameter is required',
});
const createdBy = Joi.string().trim().required().empty().messages({
    'any.required': 'CreatedBy field is required',
    'string.empty': 'CreatedBy is must be a non-empty',
});

const index = Joi.number().integer().min(1).required().messages({
    'number.base': 'Index must be a number',
    'number.min': 'Index must be greater than or equal to 1',
    'any.required': 'Index parameter is required',
});

const QA_PostValidationSchema = Joi.object({
    question: question,
    answer: answer,
    department: department,
    level: level,
    createdBy: createdBy,
});

const QA_GetValidationSchema = Joi.object({
    index: index,
    level: level,
});

const updateDepartmentSchema = Joi.object({
    department: department,
});

export { QA_PostValidationSchema, QA_GetValidationSchema, updateDepartmentSchema };
