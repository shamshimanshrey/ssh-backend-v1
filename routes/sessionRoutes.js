const express = require('express');
const router = express.Router();

const {validateSession} = require('../middlewares/validateSession');
const authUser = require('../middlewares/authUser')
const {getSessions, enterLobby} = require('../controllers/sessionControllers')
const {likeUser, likedList} = require('../controllers/likesControllers');
const authMiddleware = require('../middlewares/authUser');

router.post('/createSession', validateSession, enterLobby);
//middleware to auth the sessions.
router.use(authUser);
router.get('/getsessions',getSessions)
router.post('/like',likeUser);
router.post('/likedme',likedList);

module.exports = router; 