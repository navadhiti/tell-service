import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (email) {
                return /^[a-z0-9.]+@[a-z]+\.[a-z]{3}$/.test(email);
            },
            message:
                'Invalid Email Address. It should be in the format: user@gmail.com or user@navadhiti.com',
        },
    },
    phoneNo: {
        type: String,
        required: false,
        validate: {
            validator: function (phoneNo) {
                return /^\d{10}$/.test(phoneNo);
            },
            message:
                'The user phone must be exactly 10 digits and contain only numeric characters.',
        },
    },
    password: {
        type: String,
        required: true,
    },
});

const userModel = mongoose.model('user', schema);

export default userModel;
