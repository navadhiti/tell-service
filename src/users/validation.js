import Joi from 'joi';

const email = Joi.string()
    .pattern(/^[a-z0-9]+(?:\.[a-z0-9]+)?@[a-z]+\.[a-z]{3}$/)
    .message(
        'Invalid Email Address. It should be in the format: user@gmail.com or user@navadhiti.com'
    )
    .required();
const password = Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,12}$/)
    .message(
        'Invalid Password. It must be 8-12 characters long and contain only valid characters: letters, numbers, @, $, !, %, *, ?, or &'
    )
    .required();
const fullName = Joi.string().required().empty();
const phoneNo = Joi.string()
    .pattern(/^\d{10}$/)
    .message('The user phone must be exactly 10 digits and contain only numeric characters.')
    .required();

const registerValidationSchema = Joi.object({
    fullName: fullName,
    email: email,
    password: password,
    phoneNo: phoneNo,
});

const loginValidationSchema = Joi.object({
    email: email,
    password: password,
});

export { registerValidationSchema, loginValidationSchema };
