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

    await sendEmail(
      'artscape@abresh.com',                            // Sender email
      process.env.EMAIL_USER,                           // SMTP username for this sender
      process.env.EMAIL_PASS,                           // SMTP password for this sender
      email,                                            // Receiver email
      'You are In! Entry Pass Confirmation for ABR ArtScape',  // Subject
      `Dear ${name},\n\nWoohoo! 🎉 Your entry pass to ABR ArtScape in Hisar, Haryana, has been confirmed! 🙌 Our team will now verify your payment and details within the next 4 business hours. Once completed, your entry pass will be on its way to your inbox!\n\nGet ready to dive into an incredible celebration of art, music, food, and culture on November 9th & 10th, 2024! 🌟 This will be a festival to remember, and we’re thrilled to have you join us.\n\nThank you for being part of the ABR ArtScape experience. We can’t wait to welcome you to the event! Tell your friends—it’s going to be a creative explosion like no other! 🎨🎶\n\nBest,\nTeam ABResh Events`
  );
  
   
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