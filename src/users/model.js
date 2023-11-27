import mongoose from 'mongoose';

const nonEmptyStringValidator = {
    validator: (value) => {
        return value.trim().length > 0;
    },
    message: 'This field must be a non-empty string',
};

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        validate: nonEmptyStringValidator,
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (email) {
                return /^[a-z0-9]+(?:\.[a-z0-9]+)?@[a-z]+\.[a-z]{3}$/.test(email);
            },
            message: 'Invalid Email',
        },
    },
    department: {
        type: [String],
        default: [],
    },
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: function (phoneNumber) {
                return /^\d{10}$/.test(phoneNumber);
            },
            message: 'Invalid Phone Number',
        },
    },
    password: {
        type: String,
        required: true,
        validate: nonEmptyStringValidator,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

const QA_ResultSchema = new mongoose.Schema({
    User_ID: {
        type: String,
        required: true,
        validate: nonEmptyStringValidator,
    },
    QA_ID: {
        type: String,
        required: true,
        validate: nonEmptyStringValidator,
    },
    questionResult: {
        type: String,
        required: true,
        validate: nonEmptyStringValidator,
    },
    answerResult: {
        type: String,
        required: true,
        validate: nonEmptyStringValidator,
    },
    questionMark: {
        type: String,
        required: true,
        validate: nonEmptyStringValidator,
    },
    answerMark: {
        type: String,
        required: true,
        validate: nonEmptyStringValidator,
    },
    level: {
        type: String,
        default: '1',
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    time: {
        type: Date,
        default: Date.now,
    },
});

const userModel = mongoose.model('user', UserSchema);
const QA_ResultModel = mongoose.model('result', QA_ResultSchema);

export { userModel, QA_ResultModel };
