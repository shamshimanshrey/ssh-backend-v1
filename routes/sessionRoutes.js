const express = require('express');
const router = express.Router();

const {validateSession} = require('../middlewares/validateSession');
const {getSessions, enterLobby} = require('../controllers/sessionControllers')
const {likeUser, likedList} = require('../controllers/likesControllers')

router.post('/createSession', validateSession, enterLobby);
//middleware to auth the sessions.
router.get('/getsessions',getSessions)
router.post('/like',likeUser);
router.post('/likedme',likedList);

module.exports = router; 