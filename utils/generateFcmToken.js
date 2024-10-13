// utils/generateFcmToken.js
const crypto = require('crypto');

// Generate a random 32-byte FCM-like token
const generateFcmToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = generateFcmToken;
