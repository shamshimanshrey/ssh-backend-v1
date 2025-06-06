const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/refresh');

const { generateAccessToken, generateRefreshToken } = require('../Utils/jwtUtils');
const Session = require('../models/session');


const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

async function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies?.refreshToken;

    let accessToken = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        accessToken = authHeader.split(' ')[1];
    }

    // Try access token first if present
    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, JWT_SECRET);
            req.user = decoded;
            return next(); // ✅ Valid access token, continue
        } catch (error) {
            if (error.name !== 'TokenExpiredError') {
                return res.status(401).json({ error: 'Invalid access token' ,logOut: true});
            }
            // ⏰ If expired, fall back to refresh
        }
    }


    if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token provided',logout: true});
    }

    try {
        let decodedRefresh;
        try {
            decodedRefresh = jwt.verify(refreshToken, REFRESH_SECRET);
        } catch (err) {
            return res.status(401).json({ error: 'Invalid or expired refresh token handel logout', logout: true });
        }
        const savedToken = await RefreshToken.findOne({ tokenID: decodedRefresh.jti, userID: decodedRefresh.userID });
        if (!savedToken) {
            return res.status(403).json({ error: 'RefreshToken reuse' , logout: true })
        }
        //if someone tries to make a request with the old token we will know for sure its a reuse. because it is getting verified
        await RefreshToken.deleteOne({_id:savedToken._id});

        //create new tokens
        const session = await Session.findOne({ userID: decodedRefresh.userID }).sort({ createdAt: -1 });
        if(!session){
            return res.status(403).json({error:"session does not exist",logout: true});
        }

        
        const newAccessToken =  generateAccessToken({  userID: decodedRefresh.userID, lobbyUserID: session._id });
        //check if the time is getting extented 
        const newRefreshToken = await generateRefreshToken(decodedRefresh.userID);
        // flow to set the tokens and will frontend and backend talk to eachother and will the token be set.
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 1000 * 60 * 60 * 24,
        });

        //check if new access token came use it.
        res.setHeader('x-new-access-token', newAccessToken);

        // Inject new user object for next handler
        req.user = jwt.decode(newAccessToken); // use decode instead of verify again

        return next();

    
    } catch (error) {
         console.error('Token refresh failed:', error);
        return res.status(403).json({ error: 'Invalid refresh token', logout: true });
    }
}

module.exports = authMiddleware;