const eventModel = require('../models/event.model.js');

function sanitizeEvent(event) {
    const eventData = event.toObject ? event.toObject() : event;
    eventData.availableSeats = Math.max(0, Math.min(eventData.availableSeats, eventData.totalSeats));
    return eventData;
}

async function getAllEvents(req, res){
    try {

        const filters = {};
        if(req.query.category){
            filters.category = req.query.category;
        }
        if(req.query.location){
            filters.location = req.query.location;
        }
        if(req.query.date){
            filters.date = req.query.date;
        }

        const events = await eventModel.find(filters);
        res.status(200).json(events.map(sanitizeEvent));
    } catch (error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

async function getEventById(req, res){
    try {
        const event = await eventModel.findById(req.params.id);
        if (!event) {
            return res.status(404).json({message: 'Event not found'});
        }

        res.status(200).json(sanitizeEvent(event));
    } catch (error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

async function createEvent(req, res){
    try {
        const {title, description, date, location, category, price, totalSeats, image} = req.body;
        const totalSeatsNum = Number(totalSeats);
        const priceNum = Number(price);

        const event = await eventModel.create({
            title,
            description,
            date,
            location,
            category,
            price: priceNum,
            totalSeats: totalSeatsNum,
            availableSeats: totalSeatsNum,
            image,
            organizer: req.user._id
        });

        res.status(201).json(event);
    } catch (error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

async function updateEvent(req, res){
    try {
        const {title, description, date, location, category, price, totalSeats, image} = req.body;
        const totalSeatsNum = Number(totalSeats);
        const priceNum = Number(price);

        const event = await eventModel.findById(req.params.id);
        if (!event) {
            return res.status(404).json({message: 'Event not found'});
        }

        const confirmedSeats = event.totalSeats - event.availableSeats;
        if (totalSeatsNum < confirmedSeats) {
            return res.status(400).json({ message: `Cannot reduce total seats below already confirmed ${confirmedSeats} seats.` });
        }

        event.title = title;
        event.description = description;
        event.date = date;
        event.location = location;
        event.category = category;
        event.price = priceNum;
        event.availableSeats = totalSeatsNum - confirmedSeats;
        event.totalSeats = totalSeatsNum;
        event.image = image;

        await event.save();

        res.status(200).json(event);
    } catch (error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

async function deleteEvent(req, res){
    try {
        const event = await eventModel.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({message: 'Event not found'});
        }
        res.status(200).json({
            message: 'Event deleted successfully',
            event
        });
    } catch (error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};



