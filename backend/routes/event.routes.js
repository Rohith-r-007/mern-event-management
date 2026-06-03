const express = require('express');
const router = express.Router();
const { protect, adminProtect } = require('../middleware/auth.middleware');
const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controller/event.controller.js');

//get all events
router.get('/',protect, getAllEvents);

// get event by id
router.get('/:id', protect, getEventById);


// create event (Admin only)
router.post('/', protect, adminProtect, createEvent);

// update event (Admin only)
router.put('/:id', protect, adminProtect, updateEvent);

// delete event (Admin only)
router.delete('/:id', protect, adminProtect, deleteEvent);

module.exports = router;