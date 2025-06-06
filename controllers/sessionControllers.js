const Session = require('../models/session');
const User = require('../models/user');
const {generateAccessToken, generateRefreshToken} = require('../Utils/jwtUtils')

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
        const accessToken = generateAccessToken({ userID:userID, lobbyUserID: session._id });
        const refreshToken = await generateRefreshToken(userID);

        const { coordinates } = req.lobby.lobbyLocation;
        const radius = req.lobby.radius;

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 1000 * 60 * 60 * 24
        })
        
        res.setHeader('x-access-token', accessToken);

        return res.status(201).json({
            message: 'session created',
            radius: radius,
            lobbyLocation: coordinates,

        })

    } catch (error) {
        console.error('Create Session Error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

const getSessions = async (req, res) => {

    try {
        
        const sessionID = req.user?.lobbyUserID;
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


const updatePofileData = async (req,res) =>{

}


module.exports = { enterLobby, getSessions };