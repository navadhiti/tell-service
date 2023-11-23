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
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,12}$/)
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
const questionMark = Joi.string().trim().required().empty().messages({
    'any.required': 'Question Mark field is required',
    'string.empty': 'Question Mark is must be a non-empty',
});
const answerMark = Joi.string().trim().required().empty().messages({
    'any.required': 'Answer Mark field is required',
    'string.empty': 'Answer Mark is must be a non-empty',
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
});

export { registerValidationSchema, loginValidationSchema, markResutValidationSchema };
