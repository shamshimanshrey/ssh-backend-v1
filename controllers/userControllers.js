const User = require('../models/user');

const signUpUser = async (req, res) => {
    try {
        const { name, dob, gender,answers,preferences, } = req.body;

        if (!name || !dob || !answers|| !preferences|| !gender) {
            return res.status(400).json({ error: "all fields are not there" });
        }

        const user = await User.create({ name, dob, gender,answers,preferences});

        res.status(201).json({
            userCreated: true,
            userID: user._id,
        });
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

const profileData = async (req, res) => {
    try {
        const userID = req.header('X-user-Data');
        if (!userID) {
            res.status(400).json({ error: "userID doesnt exist" })
        }
        const user = await User.findById(userID);
        res.status(200).json({
            name: user.name,
            dob: user.dob,
            gender: user.gender,
            answers: user.answers,
            preferences: user.preferences,
        });

    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ error: `profile dosn't exist` });
    }
}

module.exports = { signUpUser, profileData };