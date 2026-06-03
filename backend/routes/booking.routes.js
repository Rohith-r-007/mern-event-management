const express = require('express');
const router = express.Router();
const { protect, adminProtect } = require('../middleware/auth.middleware');
const { bookEvent, getMyBookings, getAllBookings, confirmBooking, deleteBooking, clearCancelledBookings, sendBookingOtp } = require('../controller/booking.controller.js');

router.post('/', protect, bookEvent);
router.post('/send-otp', protect, sendBookingOtp);
router.get('/my', protect, getMyBookings);
router.get('/', protect, adminProtect, getAllBookings);
router.delete('/cancelled', protect, adminProtect, clearCancelledBookings);
router.delete('/:id', protect, deleteBooking);

// admin routes
router.put('/:id/confirm', protect, adminProtect, confirmBooking);

module.exports = router;