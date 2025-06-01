const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
     gender: {
        type: String,
        required: true,
    },
    answers: {
        type: [String],
        required: true,
    },
     preferences: {
        type: [String],
        required: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('user',userSchema);
