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
    level: {
        type: Number,
        required: false,
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
    attempt: { type: mongoose.Schema.Types.Mixed },
});

const userModel = mongoose.model('user', UserSchema);
const QA_ResultModel = mongoose.model('result', QA_ResultSchema);

export { userModel, QA_ResultModel };
