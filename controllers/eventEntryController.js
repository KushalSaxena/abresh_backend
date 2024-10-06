const EventEntry = require('../models/eventEntryModel');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();  // Load environment variables

// POST route to submit the event entry form
exports.eventEntry = async (req, res) => {
  const { name, email, phone, referredBy, passCount,transactionNumber,  eventId, location, isDisclaimerChecked } = req.body;

  // Validate the required fields
  if (!name || !phone || !transactionNumber || !passCount || !eventId || !location || !isDisclaimerChecked) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Create a new entry in the database
    const newEntry = new EventEntry({
      name,
      email,
      phone,
      referredBy,
      passCount,
      transactionNumber,
      eventId,
      location: { city: location.city, date: location.date },
      isDisclaimerChecked
    });

    const saveEntry = await newEntry.save();

   
    res.status(200).json({ saveEntry});
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getEventEntries = async (req, res) => {
  try {
    const entries = await EventEntry.find();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching event entries' });
  }
};

exports.deleteEventEntry = async (req, res) => {
  const { id } = req.params;

  try {
    const entry = await EventEntry.findByIdAndDelete(id);
    if (!entry) {
      return res.status(404).json({ error: 'Event entry not found' });
    }
    res.status(200).json({ message: 'Event entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error while deleting event entry' });
  }
};