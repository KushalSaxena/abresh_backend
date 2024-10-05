// controllers/authController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt');

// Signup and email verification
// Signup and email verification
exports.signup = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists, please log in' });
    }

    // Create a new user
    const user = await User.create({ username ,email, password, role});

    // Generate a JWT token for email verification
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Verification URL
    // const verificationUrl = `http://192.168.1.10:5000/api/auth/verify-email?token=${token}`;

    // // Send email verification
    // await sendEmail(
    //   user.email,
    //   'Email Verification',
    //   `Please verify your email by clicking on the following link: ${verificationUrl}`
    // );

    // Respond with success
    res.status(201).json({ message: 'Signup successful', token , role: user.role, id: user._id});

  } catch (error) {
    // Log the exact error
    console.error('Signup error:', error);

    // Respond with error message
    res.status(400).json({ error: 'Error signing up user' });
  }
};



// // Verify Email
// exports.verifyEmail = async (req, res) => {
//   const { token } = req.query;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(400).json({ error: 'Invalid token or user not found' });
//     }

//     user.isVerified = true;
//     await user.save();

//     res.status(200).json({ message: 'Email verified successfully' });
//   } catch (error) {
//     res.status(400).json({ error: 'Invalid or expired token' });
//   }
// };

exports.login = async (req, res) => {
  const { username, email, password } = req.body;

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
    // if (!user.isVerified) {
    //   return res.status(400).json({ error: 'Please verify your email first' });
    // }

    // Compare the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    // Respond with success message and token
    res.status(200).json({ message: 'Login successful', token, role: user.role, username : user.username, email : user.email, id: user._id });

  } catch (error) {
    // Log detailed error and respond with 500 status
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
