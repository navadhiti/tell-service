import mongoose from 'mongoose';

const nonEmptyStringValidator = {
    validator: (value) => {
        return value.trim().length > 0;
    },
    message: 'This field must be a non-empty string.',
};

const departmentSchema = new mongoose.Schema({
    department: {
        type: [
            {
                type: String,
                required: true,
                trim: true,
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
});

const QA_Schema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
        validate: nonEmptyStringValidator,
    },
    answer: {
        type: String,
        required: true,
        trim: true,
        validate: nonEmptyStringValidator,
    },
    department: {
        type: [
            {
                type: String,
                required: true,
                trim: true,
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
    scenario: {
        type: String,
        required: true,
        trim: true,
        validate: nonEmptyStringValidator,
    },
    createdBy: {
        type: String,
        required: true,
        trim: true,
        validate: nonEmptyStringValidator,
    },
    updatedBy: {
        type: String,
        required: false,
        trim: true,
    },
});

const DepartmentModel = mongoose.model('department', departmentSchema);
const QA_Model = mongoose.model('questions&answer', QA_Schema);

export { DepartmentModel, QA_Model };
