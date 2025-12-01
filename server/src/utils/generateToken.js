require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtConfig = require('../configs/jwtConfig');

const generateToken = (payload) => ({
  accessToken: jwt.sign(
    { user: payload },
    process.env.ACCESS_TOKEN_SECRET,
    jwtConfig.access,
  ),
  refreshToken: jwt.sign(
    { user: payload },
    process.env.REFRESH_TOKEN_SECRET,
    jwtConfig.refresh,
  ),
});
module.exports = generateToken;
