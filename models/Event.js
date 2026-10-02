const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    sport: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    maxParticipants: { type: Number, required: true }
}, { collection: 'events' }); // <-- Added this line to force the exact collection name!

module.exports = mongoose.model('Event', eventSchema);