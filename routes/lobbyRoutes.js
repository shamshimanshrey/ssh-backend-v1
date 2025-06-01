const express = require('express');
const router = express.Router();

const {createLobby} = require('../controllers/lobbyControllers');

router.post('/createLobby',createLobby);

module.exports = router;