import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    updatedBy: {
        type: String,
        required: false,
    },
});

const QA_Model = mongoose.model('questions&answer', schema);

export default QA_Model;
