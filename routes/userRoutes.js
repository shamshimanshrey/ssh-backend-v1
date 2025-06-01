const express = require('express');
const router = express.Router();
const {signUpUser,profileData} = require("../controllers/userControllers")

router.post('/signup', signUpUser);

router.get('/profile', profileData);

module.exports = router;
