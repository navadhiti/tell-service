import mongoose from 'mongoose';

const nonEmptyStringValidator = {
    validator: (value) => {
        return value.trim().length > 0;
    },
    message: 'This field must be a non-empty string.',
};

const schema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        validate: nonEmptyStringValidator,
    },
    answer: {
        type: String,
        required: true,
        validate: nonEmptyStringValidator,
    },
    department: {
        type: [
            {
                type: String,
                required: true,
                validate: nonEmptyStringValidator,
            },
        ],
        required: true,
        validate: {
            validator: function (department) {
                return department.length > 0;
            },
            message: 'Department must be a non-empty array',
        },
    },
    level: {
        type: Number,
        required: true,
        validate: {
            validator: function (level) {
                return typeof level === 'number' && level > 0 && level % 1 === 0;
            },
            message: 'Level must be a positive integer greater than 1',
        },
    },
    createdBy: {
        type: String,
        required: true,
        validate: nonEmptyStringValidator,
    },
    updatedBy: {
        type: String,
        required: false,
    },
});

const QA_Model = mongoose.model('questions&answer', schema);

export default QA_Model;
