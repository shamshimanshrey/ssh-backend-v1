const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    tokenID: {
        type: String,
        required: true,
        unique: true,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: true }
    }
});

refreshTokenSchema.index({expiresAt:1}, {expireAfterSeconds:0});

module.exports = mongoose.model('RefreshToken',refreshTokenSchema);
