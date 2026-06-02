const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        enum: ['acc_verification', 'event_booking'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60, // 5 minutes
    },
});

const otpModel = mongoose.model('otp', otpSchema);

module.exports = otpModel;