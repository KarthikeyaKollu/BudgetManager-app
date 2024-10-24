const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Adjust the path based on your project structure

/**
 * Verifies the user from the authorization token.
 * @param {Object} event - Lambda event containing headers.
 * @returns {Promise<Object>} - Returns the user object if valid, otherwise throws an error.
 */
const verifyUser = async (event) => {
  const authHeader = event.headers.Authorization || event.headers.authorization;
  if (!authHeader) {
    throw new Error('Authorization header missing');
  }

  const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
  const decodedToken = jwt.decode(token); // Decode the token (or use verify for added security)

  if (!decodedToken || !decodedToken.sub) {
    throw new Error('Invalid token');
  }

  const user = await User.findOne({ clerkId: decodedToken.sub }).exec();
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

module.exports = { verifyUser };
