// routes/authRoutes.js
const express = require('express');
const { signup, verifyEmail, login, saveUser } = require('../controllers/authController');
const router = express.Router();


router.post('/signup', signup);
router.get('/verify-email', verifyEmail);
router.post('/login',login);
router.post('/saveUser', saveUser);

module.exports = router;
