const Session = require('../models/session');
const User = require('../models/user');

const enterLobby = async (req, res) => {
    try {
        const { userID, lobbyID } = req.body;

        const session = await Session.create({
            userID,
            lobbyID,
            matches: [],
            likes: [],
            compliments: [],
        })

        const { coordinates } = req.lobby.lobbyLocation;

        res.status(201).json({
            message: 'session created',
            sessionID: session._id,
            lobbyLocation: coordinates,
        })
    } catch (error) {
        console.error('Create Session Error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

const getSessions = async (req, res) => {

    try {
        const { sessionID } = req.body;
        if (!sessionID) {
            return res.status(400).json({ error: 'sessionID is required' });
        }

        const userSession = await Session.findById(sessionID).populate('userID');
        if (!userSession || !userSession.userID) {
            return res.status(404).json({ error: 'Session or user not found' });
        }

        const user = userSession.userID;
        const lobbyID = userSession.lobbyID;



        const matchingSessions = await Session.find({
            lobbyID,
            _id: { $ne: sessionID }
        }).populate({
            path: 'userID',
            match: { gender: { $in: user.preferences } },
            select: 'name dob answers gender'
        });
        const filteredSessions = matchingSessions.filter(s => s.userID !== null);
        res.json({
            userInfo: {
                sessionID: userSession._id,
                name: userSession.userID.name,
                dob: userSession.userID.dob,
                gender: userSession.userID.gender,
                preferences: userSession.userID.preferences,
                answers: userSession.userID.answers
            },
            swipeCards: filteredSessions.map(session => ({
                sessionID: session._id,
                name: session.userID.name,
                dob: session.userID.dob,
                gender: session.userID.gender,
                answers: session.userID.answers
            }))
        });
    } catch (error) {
        console.error('Error fetching lobby sessions:', error);
        res.status(500).json({ error: 'Server error' });
    }
}


module.exports = { enterLobby, getSessions };