const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const {emailTemplate, bookingConfirmationTemplate } = require('../templates/email.template.js');
dotenv.config(); 

// template having our credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendOtpEmail(userEmail, otp, type) {
    try {
        const title = type === 'acc_verification'
        ? 'Account Verification'
        : 'Event Booking Confirmation';

        const msg = type === 'acc_verification' 
        ? 'Your OTP for account verification is' 
        : 'Your OTP for event booking is';
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `${otp} - ${title}`,
            html: emailTemplate(title, msg, otp) //styling
        };
    
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${userEmail} for ${type}`);

    } catch (error) {
        console.log('Error sending email', error);
    }
}

async function sendBookingEmail(userEmail, userName, eventTitle) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `${eventTitle} - Booking Confirmation`,
            html: bookingConfirmationTemplate(userName, eventTitle)
        }

        await transporter.sendMail(mailOptions);
        console.log(`Booking confirmation sent to ${userEmail} for ${eventTitle}`);
    } catch (error) {
        console.log('Error sending booking email', error);
    }
}

module.exports = {
    sendOtpEmail,
    sendBookingEmail
}