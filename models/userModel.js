// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username : {
    type : String,
    required : true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // isVerified: {
  //   type: Boolean,
  //   default: false,
  // },
  role: {
    type: String,
    enum: ['Admin', 'User', 'Volunteer'],
    required : true // Only allows Admin and Customer roles
  },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
