const bookingModel = require('../models/booking.model.js');
const otpModel = require('../models/otp.model.js');
const eventModel = require('../models/event.model.js');
const { sendOtpEmail, sendBookingEmail } = require('../utils/email.js');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

async function sendBookingOtp(req, res) {
    const { eventId } = req.body;
    const otp = generateOTP();

    const event = await eventModel.findById(eventId);
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    await otpModel.findOneAndDelete({ email: req.user.email, action: 'event_booking' });
    await otpModel.create({
        email: req.user.email,
        otp: otp,
        action: 'event_booking',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    await sendOtpEmail(req.user.email, otp, 'event_booking', {
        title: event.title,
        date: event.date,
        location: event.location
    });
    res.status(200).json({ message: 'OTP sent successfully' });
}

async function bookEvent(req, res) {
    const { eventId, otp, numberOfTickets = 1 } = req.body;

    if (!otp) {
        return res.status(400).json({ message: 'OTP is required to confirm booking' });
    }

    const otpRecord = await otpModel.findOne({ email: req.user.email, action: 'event_booking' });
    if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const event = await eventModel.findById(eventId);
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }
    if (event.availableSeats < numberOfTickets) {
        return res.status(400).json({ message: 'Not enough seats available' });
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

    event.availableSeats -= numberOfTickets;
    await event.save();

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
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    booking.status = 'confirmed';
    if(paymentStatus === 'paid') {
        booking.paymentStatus = 'paid';
    }
    await booking.save();

    await sendBookingEmail(req.user.email, req.user.name, event.title);

    res.status(200).json({ message: 'Booking confirmed successfully' });
}

async function getMyBookings(req, res) {
    const bookings = await bookingModel.find({ userId: req.user._id }).populate('eventId');
    res.status(200).json(bookings);
}

async function getAllBookings(req, res) {
    const bookings = await bookingModel.find().populate('eventId').populate('userId');
    res.status(200).json(bookings);
}

async function deleteBooking(req, res) {
    const booking = await bookingModel.findById(req.params.id);
    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'pending' || booking.status === 'confirmed'){
        const event = await eventModel.findById(booking.eventId);
        if (event) {
            event.availableSeats += booking.numberOfTickets;
            await event.save();
        }
    }

    booking.status = 'cancelled';
    await booking.save();

    await bookingModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ 
        message: 'Booking deleted successfully' });
}

async function clearCancelledBookings(req, res) {
    const result = await bookingModel.deleteMany({ status: 'cancelled' });
    res.status(200).json({ message: `${result.deletedCount} cancelled bookings removed.` });
}

module.exports = {
    bookEvent,
    confirmBooking,
    getMyBookings,
    getAllBookings,
    deleteBooking,
    clearCancelledBookings,
    sendBookingOtp
};

