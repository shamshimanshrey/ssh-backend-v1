const Lobby = require('../models/lobby');

const createLobby = async (req, res) =>{
    try {
        const {lobbyName,coordinates,radius,lobbyType} = req.body;
        if(!lobbyName || !coordinates || !radius || !lobbyType){
            return res.status(400).json({error:'All fields are required'});
        }

        const lobby = await Lobby.create({
            lobbyName,
            lobbyLocation: {
                type:'Point',
                coordinates,
            },
            radius,
            lobbyType,
        });
        res.status(201).json({ message: 'Lobby created' });

    } catch (error) {
         console.error('Create Lobby Error:', error.message);
    res.status(500).json({ error: 'Server error lobby' });
    }
}


module.exports = {createLobby};