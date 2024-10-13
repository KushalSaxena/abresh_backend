// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin.json'); // Ensure the path is correct

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
