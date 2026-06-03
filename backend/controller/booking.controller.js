const bookingModel = require('../models/booking.model.js');
const otpModel = require('../models/otp.model.js');
const eventModel = require('../models/event.model.js');
const { sendOtpEmail, sendBookingEmail } = require('../utils/email.js');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

async function sendBookingOtp(req, res) {
    const otp = generateOTP();
    await otpModel.findOneAndDelete({ email: req.user.email, action: 'event_booking' });
    await otpModel.create({
        email: req.user.email,
        otp: otp,
        action: 'event_booking',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });
    await sendOtpEmail(req.user.email, otp, 'event_booking');
    res.status(200).json({ message: 'OTP sent successfully' });
}

async function bookEvent(req, res) {
    const { eventId, numberOfTickets } = req.body;
    
    const otpRecord = await otpModel.findOne({ email: req.user.email, action: 'event_booking' });
    if (!otpRecord) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    const event = await eventModel.findById(eventId);
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }
    if (event.totalSeats <= 0) {
        return res.status(400).json({ message: 'Event is full' });
    }

    const existingBooking = await bookingModel.findOne({ userId: req.user._id, eventId: eventId });
    if (existingBooking) {
        return res.status(400).json({ message: 'You have already booked this event' });
    }

    const booking = await bookingModel.create({
        userId: req.user._id,
        eventId: eventId,
        numberOfTickets: numberOfTickets,
        status: 'pending',
        totalPrice: event.price * numberOfTickets,
    });

    await otpModel.deleteMany({ email: req.user.email, action: 'event_booking' });

    res.status(201).json({ 
        message: 'Booking created successfully',
        booking: booking
    });
    
}

async function confirmBooking(req, res) {
    const { paymentStatus } = req.body;
    const booking = await bookingModel.findById(req.params.id);

    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.paymentStatus === 'paid') {
        return res.status(400).json({ message: 'Payment already done' });
    }

    const event = await eventModel.findById(booking.eventId);
    if (event.totalSeats < booking.numberOfTickets) {
        return res.status(400).json({ message: 'Not enough seats available' });
    }

    booking.status = 'confirmed';
    if(paymentStatus === 'paid') {
        booking.paymentStatus = 'paid';
    }
    await booking.save();

    event.totalSeats -= booking.numberOfTickets;
    await event.save();

    await sendBookingEmail(req.user.email, req.user.name, event.title);

    res.status(200).json({ message: 'Booking confirmed successfully' });
}

async function getMyBookings(req, res) {
    const bookings = await bookingModel.find({ userId: req.user._id }).populate('eventId');
    res.status(200).json(bookings);
}

async function deleteBooking(req, res) {
    const booking = await bookingModel.findById(req.params.id);
    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'confirmed'){
        const event = await eventModel.findById(booking.eventId);
        event.totalSeats += booking.numberOfTickets;
        await event.save();
    }

    booking.status = 'cancelled';
    await booking.save();

    await bookingModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ 
        message: 'Booking deleted successfully' });
}

module.exports = {
    bookEvent,
    confirmBooking,
    getMyBookings,
    deleteBooking,
    sendBookingOtp
};

