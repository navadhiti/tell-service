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
        type: String,
        required: true,
        validate: nonEmptyStringValidator,
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
