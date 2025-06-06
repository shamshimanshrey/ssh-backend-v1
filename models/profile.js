const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    public_id: {
        type: String,
        required: true,
    },
    format: {
        type: String,
        required: true,
    },
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    bytes: {
        type: Number,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('profiles', profileSchema);
