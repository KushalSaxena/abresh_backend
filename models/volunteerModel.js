const mongoose = require('mongoose');

// Define Volunteer Schema
const volunteerSchema = new mongoose.Schema({
  completeName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique : true,
  },
  instagramHandle: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  institute: {
    type: String,
    required: true,
  },
  referredBy: {
    type: String,
    required: true,
  },
  interviewBy: {
    type: String,
    required: true,
  },
  interviewStatus: {
    type: String,
    enum: ['Not Answered', 'Selected', 'Rejected'],  
    required: true,
    // Example statuses
  },
  briefedBy: {
    type: String,
    required: true,
  },
  bioData: {
    type: String,
    required: true,
  },
  photo: {
    type: String,  
    required: true,// Store file path or URL
  },
  stallStatus: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],  // Example statuses
    required: true,
  },
  recruitedVolunteers: {
    type: Number,
    default: 0, // Track the number of volunteers recruited by this volunteer
  },
  competitionParticipants: {
    type: Number,
    default: 0, // Track the number of participants they brought into competitions
  },
  stallBookings: {
    type: Number,
    default: 0, // Track the number of stalls booked by this volunteer
  },
  incentiveEarned: {
    type: Number,
    default: 0, // Total incentive earned for this volunteer
  },
  assignedColor : {
    type : String
  }
}, { timestamps: true });

// Create Volunteer Model
const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;
