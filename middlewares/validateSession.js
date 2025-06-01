const User = require('../models/user');
const Lobby = require('../models/lobby');

const validateSession = async (req,res,next)=>{
const {userID,lobbyID} = req.body;

if(!userID || !lobbyID){
    return req.status(400).json({error: 'userID and lobbyID are required'});
}

const user = await User.exists({_id: userID});
const lobby = await Lobby.findById(lobbyID);

if(!user){
    return res.status(404).json({error:"user not found"});
}

if(!lobby){
       return res.status(404).json({error:"Lobby doesnt exist"});
}

req.lobby = lobby;
next();

}

module.exports = {validateSession};


