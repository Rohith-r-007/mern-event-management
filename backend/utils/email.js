const dotenv = require('dotenv');
const {emailTemplate, bookingConfirmationTemplate } = require('../templates/email.template.js');
const { Resend } = require('resend');
dotenv.config(); 


const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOtpEmail(userEmail, otp, type, eventDetails = null) {
    try {
        const title = type === 'acc_verification'
        ? 'Account Verification'
        : 'Event Booking Confirmation';

        const msg = type === 'acc_verification' 
        ? 'Your OTP for account verification is' 
        : 'Your OTP for event booking is';
        
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: userEmail,
            subject: `${otp} - ${title}`,
            html: emailTemplate(title, msg, otp, eventDetails)
        });
    
        console.log(`OTP sent to ${userEmail} for ${type}`);

    } catch (error) {
        console.log('Error sending email', error);
    }
}

async function sendBookingEmail(userEmail, userName, eventTitle) {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: userEmail,
            subject: `${eventTitle} - Booking Confirmation`,
            html: bookingConfirmationTemplate(userName, eventTitle)
        });

        console.log(`Booking confirmation sent to ${userEmail} for ${eventTitle}`);
    } catch (error) {
        console.log('Error sending booking email', error);
    }
}

module.exports = {
    sendOtpEmail,
    sendBookingEmail
}