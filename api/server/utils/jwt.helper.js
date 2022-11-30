const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = require("../../../config");
const UserService = require("../services/user");

function decodeToken(token) {
  return jwt.decode(token.replace("Bearer ", ""));
}

async function getAuthUser(token) {
  try {
    const tokenData = decodeToken(token);
    //
    const user = await UserService.findById(tokenData.UserID);
    //
    const resUser = JSON.parse(JSON.stringify(user));
    delete resUser.recordset[0].password;
    return resUser.recordset[0];
  } catch (e) {
    return null;
  }
}

const expiresIn = "365d";

function getJWTToken(data) {
  const token = `Bearer ${jwt.sign(data, config.jwtSecret, { expiresIn })}`;
  return token;
}

module.exports = { decodeToken, getJWTToken, getAuthUser };
