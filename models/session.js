const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
     lobbyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lobby',
        required: true,
    },
    matches: [{
  sessionID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  text: {
    type: String,
    default: ''
  },
  isLike: {
    type: Boolean,
    default: true
  }
}],
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Session'
    }],
    compliments:[{
    sessionID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session'
    },
    text: String
  }]
},{timeseries:true});

module.exports = mongoose.model('Session',sessionSchema);





