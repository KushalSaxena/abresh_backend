const mongoose = require('mongoose');

// Define Task Schema
// Define Task Schema
const announcementSchema = new mongoose.Schema({
    username : {
      type : String,
      required : true
    },
    userRequest: {
      type: String, // User request visible to the admin
      default: null
    }
  }, { timestamps: true });
  
  // Create Task Model
  const Announcement = mongoose.model('Announcement', announcementSchema);
  
  module.exports = Announcement;
  
