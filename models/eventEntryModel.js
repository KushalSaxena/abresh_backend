const mongoose = require('mongoose');

const eventEntrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: Number, required: true },
  referredBy : {type : String},
  passCount: { type: String, required: true },
  transactionNumber: { type: String, required: true },
  eventId: { type: 'String', required: true },  // Reference to the Event
  location: {  // Embedded location data (city and date)
    city: { type: String, required: true },
    date: { type: String, required: true }
  },
  isDisclaimerChecked: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EventEntry', eventEntrySchema);
