const mongoose = require('mongoose');

// Define Volunteer Schema
const volunteerSchema = new mongoose.Schema({
  completeName: {
    type: String,
    required: true,
  },
  gender:{
    type : String,
    required : true
  },
  dob: {
    type : String,
    required : true    
  },
  pincode : {
    type : String,
    required : true
  },
  mobile: {
    type: String,
    required: true,
  },
  alternateNumber : {
    type : String,
  },
  email: {
    type: String,
    required: true,
    unique : true,
  },
  profession: {
    type: String,
  },
  institute: {
    type: String,
  },
  referredBy: {
    type: String,
    required: true,
  },
  interviewBy: {
    type: String,
    enum : ['Backend', 'Arin', 'Rishika'],
    default : 'Backend'
  },
  interviewStatus: {
    type: String,
    enum: ['Not Answered', 'Selected', 'Rejected'],  
    default : 'Not Answered'
    // Example statuses
  },
  stallStatus: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'], 
    default : 'Pending' // Example statuses
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
  referredPass:{
    type : String,
    default : '0'
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
