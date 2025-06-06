const Session = require('../models/session');
const User = require('../models/user')

const likeUser = async (req, res) => {
    try {

        const {  targetSessionID, givenCompliment, isLike } = req.body;
        const mySessionID = req.user?.lobbyUserID
        if (!targetSessionID) {
            return res.status(400).json({ error: 'targetSessionID is required' });
        }

        if (mySessionID === targetSessionID) {
            return res.status(400).json({ error: 'You cannot like yourself' });
        }

        const targetSession = await Session.findById(targetSessionID);
        const mySession = await Session.findById(mySessionID);

        if (!targetSession || !mySession) {
            return res.status(404).json({ error: 'Session(s) not found' });
        }
        //checks if match already exists
        const alreadyMatched = mySession.matches.some(
            m => m.sessionID.toString() === targetSessionID.toString()
        ) || targetSession.matches.some(
            m => m.sessionID.toString() === mySessionID.toString()
        );

        if (alreadyMatched) {
            return res.json({ match: true, message: 'Already a match' });
        }


        //handelling like logic
        if (isLike) {
            // mySession liked targetSession and targetSession has already liked mySession before - (creates a match)
            if (mySession.likes.includes(targetSessionID)) {
                targetSession.matches.push({
                    sessionID: mySessionID,
                    text: "",
                    isLike: true
                });
                mySession.matches.push({
                    sessionID: targetSessionID,
                    text: "",
                    isLike: true
                });
                mySession.likes = mySession.likes.filter(id => id.toString() !== targetSessionID.toString());
                await mySession.save();
                await targetSession.save();
                return res.json({ match: true, message: 'It\'s a match!' });
            }
            else if (mySession.compliments.some(c => c.sessionID.toString() === targetSessionID.toString())) {
                //create matches
                targetSession.matches.push({
                    sessionID: mySessionID,
                    text: "",
                    isLike: true
                });
                const compliment = mySession.compliments.find(
                    c => c.sessionID.toString() === targetSessionID.toString()
                );
                let text = "";
                if (compliment) {
                    text = compliment.text;
                }
                mySession.matches.push({
                    sessionID: targetSessionID,
                    text: text,
                    isLike: false
                });

                //remove likes and compliment
                mySession.compliments = mySession.compliments.filter(
                    c => c.sessionID.toString() !== targetSessionID.toString()
                );

                await mySession.save();
                await targetSession.save();
                return res.json({ match: true, message: 'It\'s a match!' });
            }
            else {
                if (!targetSession.likes.includes(mySessionID)) {
                    targetSession.likes.push(mySessionID);
                    await targetSession.save();
                    return res.json({ match: false, message: 'Liked successfully' });
                }

                else {
                    return res.json({ match: false, message: 'already liked' });
                }
            }
        }
        //handelling compliment logic
        else {

            // user x liked profile y , and profile y has complimented user x - (creates a match + first msg turns out to be the complment.)
            if (mySession.likes.includes(targetSessionID)) {
                targetSession.matches.push({
                    sessionID: mySessionID,
                    text: givenCompliment,
                    isLike: false
                });
                mySession.matches.push({
                    sessionID: targetSessionID,
                    text: "",
                    isLike: true
                });
                mySession.likes = mySession.likes.filter(id => id.toString() !== targetSessionID.toString());
                await mySession.save();
                await targetSession.save();
                return res.json({ match: true, message: 'It\'s a match!' });
            }
            else if (mySession.compliments.some(c => c.sessionID.toString() === targetSessionID.toString())) {
                //create matches
                targetSession.matches.push({
                    sessionID: mySessionID,
                    text: givenCompliment,
                    isLike: false
                });
                const compliment = mySession.compliments.find(
                    c => c.sessionID.toString() === targetSessionID.toString()
                );
                let text = "";
                if (compliment) {
                    text = compliment.text;
                }
                mySession.matches.push({
                    sessionID: targetSessionID,
                    text: text,
                    isLike: false
                });
                //remove likes and compliment
                mySession.compliments = mySession.compliments.filter(
                    c => c.sessionID.toString() !== targetSessionID.toString()
                );

                await mySession.save();
                await targetSession.save();
                return res.json({ match: true, message: 'It\'s a match!' });
            }
            else {
                if (!targetSession.compliments.some(c => c.sessionID.toString() === mySessionID.toString())) {
                    targetSession.compliments.push({
                        sessionID: mySessionID,
                        text: givenCompliment,
                        isLike: false
                    });
                    await targetSession.save();
                    return res.json({ match: false, message: 'complimented successfully' });
                }

                else {
                    return res.json({ match: false, message: 'already complimented' });
                }
            }

        }

    } catch (err) {
        console.error('Like Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

const likedList = async (req, res) => {
    try {
       const mySessionID = req.user?.lobbyUserID;

        if (!mySessionID) {
            return res.status(400).json({ error: 'mySessionID is required' });
        }

        const mySession = await Session.findById(mySessionID).populate('userID');
        if (!mySession) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const likedByIDs = mySession.likes; // Array of sessionIDs
        const complimentedByObjs = mySession.compliments; // Array of { sessionID, text }

        // Collect unique sessionIDs
        const complimentedByIDs = complimentedByObjs.map(c => c.sessionID.toString());
        const allSessionIDs = [...new Set([...likedByIDs.map(id => id.toString()), ...complimentedByIDs])];

        const likedSessions = await Session.find({
            _id: { $in: allSessionIDs }
        }).populate('userID', '-preferences -_id');

         const results = likedSessions.map(session => {
            const sessionID = session._id.toString();
            const complimentObj = complimentedByObjs.find(c => c.sessionID.toString() === sessionID);

            return {
                sessionID,
                user: session.userID,
                isLike: likedByIDs.map(id => id.toString()).includes(sessionID),
                text: complimentObj ? complimentObj.text : null
            };
        });

        return res.json({
            mySession: {
                sessionID: mySession._id,
                user: mySession.userID
            },
            receivedInteractions: results
        });

    } catch (err) {
        console.error('Liked List Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
module.exports = { likeUser, likedList }




//check if the targetsessionID and mysessionID is in the same lobby or not, else user user will be able to like anyone form other lobby.