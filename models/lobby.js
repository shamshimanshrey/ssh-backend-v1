const mongoose = require('mongoose');

const lobbySchema = new mongoose.Schema({
    lobbyName: {
        type: String,
        required: true,
    },
    lobbyLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    radius: {
        type: Number,
        required: true,
    },
    lobbyType: {
        type: String,
        enum: ['public', 'private', 'matchmaking'],
        required: true,
    },
}, {
    timestamps: true,
});

lobbySchema.index({ lobbyLocation: '2dsphere' });

module.exports = mongoose.model('Lobby', lobbySchema);