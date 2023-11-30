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
        trim: true,
        validate: nonEmptyStringValidator,
    },
    email: {
        type: String,
        required: true,
        trim: true,
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
        trim: true,
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
        trim: true,
        validate: nonEmptyStringValidator,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

const QA_ResultSchema = new mongoose.Schema({
    user_ID: {
        type: String,
        required: true,
        trim: true,
        validate: nonEmptyStringValidator,
    },
    attempt: [
        [
            {
                QA_ID: {
                    type: String,
                    required: true,
                    trim: true,
                    validate: nonEmptyStringValidator,
                },
                questionResult: {
                    type: String,
                    required: true,
                    trim: true,
                    validate: nonEmptyStringValidator,
                },
                answerResult: {
                    type: String,
                    required: true,
                    trim: true,
                    validate: nonEmptyStringValidator,
                },
                questionMark: {
                    type: Number,
                    required: true,
                },
                answerMark: {
                    type: Number,
                    required: true,
                },
                level: {
                    type: Number,
                    required: true,
                },
                timeTakenForQuestion: {
                    type: Number,
                    required: true,
                },
                timeTakenForAnswer: {
                    type: Number,
                    required: true,
                },
            },
        ],
    ],
});

const userModel = mongoose.model('user', UserSchema);
const QA_ResultModel = mongoose.model('result', QA_ResultSchema);

export { userModel, QA_ResultModel };
