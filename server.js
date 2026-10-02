const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Event = require('./models/Event');
const Registration = require('./models/Registration');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Successfully!'))
    .catch((err) => console.error('MongoDB connection error:', err));

// --- API ROUTES ---

// 1. Get all sports events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// 2. Create a new event
app.post('/api/events', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create event' });
    }
});

// 3. Register a student
app.post('/api/register', async (req, res) => {
    try {
        const { eventId, studentName, email, department } = req.body;
        const newRegistration = new Registration({ eventId, studentName, email, department });
        await newRegistration.save();
        res.status(201).json({ message: 'Registration successful!', newRegistration });
    } catch (err) {
        console.error("DETAILED REGISTRATION ERROR:", err.message); // Print exact error
        res.status(400).json({ error: err.message }); // Send it back to frontend
    }
});

// 4. Get all student registrations (for Admin Dashboard)
app.get('/api/registrations', async (req, res) => {
    try {
        const registrations = await Registration.find().populate('eventId');
        res.json(registrations);
    } catch (err) {
        console.error("Error fetching registrations:", err.message);
        res.status(500).json({ error: 'Failed to fetch registrations' });
    }
});

// 5. Delete an event and all its associated student registrations
app.delete('/api/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        
        // Delete the event itself
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Cascade delete: remove all registrations tied to this event
        await Registration.deleteMany({ eventId: eventId });

        res.json({ message: 'Event and associated registrations deleted successfully!' });
    } catch (err) {
        console.error("Error deleting event:", err.message);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running live at http://localhost:${PORT}`);
});