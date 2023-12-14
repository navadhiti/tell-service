import Joi from 'joi';

const email = Joi.string()
    .trim()
    .pattern(/^[a-z0-9]+(?:\.[a-z0-9]+)?@[a-z]+\.[a-z]{3}$/)
    .message('Invalid Email')
    .required()
    .empty()
    .messages({
        'any.required': 'Email field is required',
        'string.empty': 'Email field is must be a non-empty',
    });
const password = Joi.string()
    .trim()
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/)
    .message('Invalid Password')
    .required()
    .empty()
    .messages({
        'any.required': 'Password field is required',
        'string.empty': 'Password field is must be a non-empty',
    });
const fullName = Joi.string().trim().required().empty().messages({
    'any.required': 'Full Name field is required',
    'string.empty': 'Full Name field is must be a non-empty',
});
const phoneNumber = Joi.string()
    .trim()
    .pattern(/^\d{10}$/)
    .message('Invalid Phone Number')
    .required()
    .empty()
    .messages({
        'any.required': 'Phone Number field is required',
        'string.empty': 'Phone Number is must be a non-empty',
    });

const QA_ID = Joi.string()
    .trim()
    .regex(/^[0-9a-z]{24}$/)
    .message('Invalid QA_ID')
    .required()
    .empty()
    .messages({
        'any.required': 'QA ID field is required',
        'string.empty': 'QA ID is must be a non-empty',
    });
const questionResult = Joi.string().trim().required().empty().messages({
    'any.required': 'Question Result field is required',
    'string.empty': 'Question Result is must be a non-empty',
});
const answerResult = Joi.string().trim().required().empty().messages({
    'any.required': 'Answer Result field is required',
    'string.empty': 'Answer Result is must be a non-empty',
});
const questionMark = Joi.number().integer().min(0).required().messages({
    'number.base': 'Question Mark must be a number',
    'number.integer': 'Question Mark must be an integer',
    'number.min': 'Question Mark must be greater than or equal to 0',
    'any.required': 'Question Mark parameter is required',
});
const answerMark = Joi.number().integer().min(0).required().messages({
    'number.base': 'Answer Mark must be a number',
    'number.integer': 'Answer Mark must be an integer',
    'number.min': 'Answer Mark must be greater than or equal to 0',
    'any.required': 'Answer Mark parameter is required',
});
const level = Joi.number().integer().min(1).required().messages({
    'number.base': 'Level must be a number',
    'number.integer': 'Level must be an integer',
    'number.min': 'Level must be greater than or equal to 1',
    'any.required': 'Level parameter is required',
});
const timeTakenForQuestion = Joi.number().integer().min(0).required().messages({
    'number.base': 'Time Taken for Question must be a number',
    'number.integer': 'Time Taken for Question must be an integer',
    'number.min': 'Time Taken for Question must be greater than or equal to 0',
    'any.required': 'Time Taken for Question parameter is required',
});
const timeTakenForAnswer = Joi.number().integer().min(0).required().messages({
    'number.base': 'Time Taken for Answer must be a number',
    'number.integer': 'Time Taken for Answer must be an integer',
    'number.min': 'Time Taken for Answer must be greater than or equal to 0',
    'any.required': 'Time Taken for Answer parameter is required',
});

const registerValidationSchema = Joi.object({
    fullName: fullName,
    email: email,
    password: password,
    phoneNumber: phoneNumber,
});

const loginValidationSchema = Joi.object({
    email: email,
    password: password,
});

const markResutValidationSchema = Joi.object({
    QA_ID: QA_ID,
    questionResult: questionResult,
    answerResult: answerResult,
    questionMark: questionMark,
    answerMark: answerMark,
    level: level,
    timeTakenForQuestion: timeTakenForQuestion,
    timeTakenForAnswer: timeTakenForAnswer,
});

export { registerValidationSchema, loginValidationSchema, markResutValidationSchema };
