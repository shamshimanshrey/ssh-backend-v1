const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');
const RefreshToken = require('../models/refresh');


const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const ACCESS_EXPIRE = '30m';
const REFRESH_EXPIRE_SECONDS = 60*60*24;

function generateAccessToken(payload) {
    return jwt.sign(payload,JWT_SECRET,{expiresIn:ACCESS_EXPIRE});
}

async function generateRefreshToken(userID) {
  const jti = uuidv4();
  const expires = new Date(Date.now() + REFRESH_EXPIRE_SECONDS * 1000);
  const token = jwt.sign({ userID, jti }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRE_SECONDS });
  await RefreshToken.create({ tokenID: jti, userID, expiresAt: expires });
  return token;
}

module.exports = {generateAccessToken, generateRefreshToken};