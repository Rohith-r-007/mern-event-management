const userModel = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpModel = require('../models/otp.models.js');
const { sendOtpEmail, sendBookingEmail } = require('../utils/email.js');

async function registerUser(req, res) {
    const { name, email, password } = req.body;
    
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            message: 'User already exists' 
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        name, 
        email, 
        password: hashedPassword,
    });

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', token)

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`OTP for ${email}: ${otp}`); 

    await otpModel.create({
        email,
        otp,
        action: 'acc_verification',
    });

    await sendOtpEmail(email, otp, 'acc_verification');

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
    });
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: 'User not found' 
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({
            message: 'Invalid password' 
        });
    }

    if(!user.isVerified && user.role === 'user') {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`OTP for ${email}: ${otp}`);
        
        await otpModel.deleteMany({ email, action: 'acc_verification' });//deleting old otps
        
        await otpModel.create({
            email,
            otp,
            action: 'acc_verification',
        });

        await sendOtpEmail(email, otp, 'acc_verification');

        return res.status(400).json({
            message: 'User not verified, a new OTP has been sent to your email' 
        });
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    })
    res.cookie('token', token)

    res.status(200).json({
        message: 'User logged in successfully',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
    });
}

async function verifyOtp(req, res) {
    const { email, otp } = req.body;

    const otpRecord = await otpModel.findOne({ email, otp, action: 'acc_verification' });
    if (!otpRecord) {
        return res.status(400).json({
            message: 'Invalid OTP' 
        });
    }

    const user = await userModel.findOneAndUpdate({ email }, { isVerified: true });
    await otpRecord.deleteOne();

    res.status(200).json({
        message: 'OTP verified successfully' ,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
    });
}


module.exports = {
    registerUser,
    loginUser,
    verifyOtp
}