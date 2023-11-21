import Joi from 'joi';

const question = Joi.string().required().empty();
const answer = Joi.string().required().empty();
const department = Joi.string().required().empty();
const createdBy = Joi.string().required().empty();

const QA_ValidationSchema = Joi.object({
    question: question,
    answer: answer,
    department: department,
    createdBy: createdBy,
});

const indexSchema = Joi.number().integer().min(1).required();

export { QA_ValidationSchema, indexSchema };
