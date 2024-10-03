const mongoose = require('mongoose');
const Event = require('../models/eventModel.js');

const sponsorshipSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  designation: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  mailingAddress: { type: String, required: true },
  sponsorshipLevel: { type: String, required: true },
  additionalRequests: { type: String },
  paymentTerms: { type: String, required: true },
  declarationAccepted: { type: Boolean, required: true },
  eventId: { type: 'String', required: true },  // Reference to the Event
  location: {  // Embedded location data (city and date)
    city: { type: String, required: true },
    date: { type: String, required: true }
  }
});

module.exports = mongoose.model('Sponsorship', sponsorshipSchema);
