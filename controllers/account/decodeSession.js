const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

 async function decodeSession (cookie) {
 
    // Decrypt the cookie and retrieve user data with the id
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    return decoded.id


};

module.exports = {
    decodeSession
}
