// controllers/authController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const generateFcmToken = require('../utils/generateFcmToken');
const bcrypt = require('bcrypt');

// Signup and email verification
// Signup and email verification
exports.signup = async (req, res) => {
  const { username, email, password, role, fcmToken } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists, please log in' });
    }
    const tokenToSave = fcmToken || generateFcmToken();

    // Create a new user
    const user = await User.create({ username ,email, password, role, fcmToken: tokenToSave});

    // Generate a JWT token for email verification
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const verificationUrl = `http://52.66.252.88:5000/api/auth/verify-email?token=${token}`;

    // Email content
    const subject = 'Email Verification';
    const text = `Hi ${username},\n\nPlease verify your email by clicking on the following link: ${verificationUrl}\n\nThanks,\nABResh Events`;

    // Send verification email
    await sendEmail(
      'artscape@abresh.com',              // Sender email (you can change this to your desired sender email)
      process.env.EMAIL_USER,               // SMTP user from environment variables
      process.env.EMAIL_PASS,               // SMTP password from environment variables
      email,                               // Receiver's email (user's email)
      subject,                             // Email subject
      text                                 // Email body
    );

    // Respond with success
    res.status(201).json({ message: 'Signup successful', token , role: user.role, id: user._id, fcmToken: user.fcmToken,
    });

  } catch (error) {
    // Log the exact error
    console.error('Signup error:', error);

    // Respond with error message
    res.status(400).json({ error: 'Error signing up user' });
  }
};



// // Verify Email
exports.verifyEmail = async (req, res) => {
  const token = req.query.token;

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the ID in the decoded token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ error: 'Invalid token or user does not exist' });
    }

    // Check if the user's email is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Update the user's email verification status
    user.isVerified = true;
    await user.save();

    // Respond with success
    res.status(200).json({ message: 'Email verification successful. You can now log in.' });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).json({ error: 'Email verification failed' });
  }
};

exports.login = async (req, res) => {
  const { username, email, password, fcmToken } = req.body;

  try {
    // Check if both email and username are provided
    if (!email || !username) {
      return res.status(400).json({ error: 'Email and Username are required' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User with this email not found' });
    }

    // Check if the username matches the email
    if (user.username !== username) {
      return res.status(400).json({ error: 'Username does not match with the provided email' });
    }
    // Check if the email is verified
    if (!user.isVerified) {
      return res.status(400).json({ error: 'Please verify your email first' });
    }

    // Compare the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const tokenToSave = fcmToken || generateFcmToken();
    user.fcmToken = tokenToSave;
    await user.save();
    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Respond with success message and token
    res.status(200).json({ message: 'Login successful', token, role: user.role, username : user.username, email : user.email, id: user._id , fcmToken: user.fcmToken});

  } catch (error) {
    // Log detailed error and respond with 500 status
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
