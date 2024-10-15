const EventEntry = require('../models/eventEntryModel');
const sendEmail = require('../utils/sendEmail');
const admin = require('../config/firebase'); // Firebase Admin SDK setup
const User = require('../models/userModel');
require('dotenv').config();  // Load environment variables

// POST route to submit the event entry form
exports.eventEntry = async (req, res) => {
  const { name, email, phone, referredBy, passCount, transactionNumber, eventId, location, isDisclaimerChecked } = req.body;

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
      'ticket@abresh.com',                            // Sender email
      process.env.EMAIL_USER,                           // SMTP username for this sender
      process.env.EMAIL_PASS,                           // SMTP password for this sender
      email,                                            // Receiver email
      'You are In! Entry Pass Confirmation for ABR ArtScape',  // Subject
      `Dear ${name},\n\nWoohoo! 🎉 Your entry pass to ABR ArtScape in Hisar, Haryana, has been confirmed! 🙌 Our team will now verify your payment and details within the next 4 business hours. Once completed, your entry pass will be on its way to your inbox!\n\nGet ready to dive into an incredible celebration of art, music, food, and culture on November 9th & 10th, 2024! 🌟 This will be a festival to remember, and we’re thrilled to have you join us.\n\nThank you for being part of the ABR ArtScape experience. We can’t wait to welcome you to the event! Tell your friends—it’s going to be a creative explosion like no other! 🎨🎶\n\nBest,\nTeam ABResh Events`
    );

    const abr = await User.find({ role: 'Admin' });

    // Extract FCM tokens from volunteers
    const tokens = abr.map(v => v.fcmToken).filter(Boolean);

    if (tokens.length) {
      const message = {
        notification: {
          title: 'Event passes booking!',
          body: `${name} has booked a pass`,
        },
        tokens, // List of FCM tokens
      };

      console.log('Prepared FCM message:', message);

      // Send the notification to multiple devices
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log('Notification send response:', response);

      // Log detailed errors for failed tokens
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`Failed to send to token: ${tokens[idx]}`, resp.error);
        }
      });

    } else {
      console.log('No valid FCM tokens found.');
    }
    res.status(200).json({ saveEntry });
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

exports.updateEventEntry = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      referredBy,
      passCount,
      transactionNumber
    } = req.body;

    const { eventId } = req.params; // Extract stallId from req.params

    // Check if the stallId is provided
    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required." });
    }

    // Find the existing BookStall entry by ID
    const existingEvent = await EventEntry.findById(eventId);

    if (!existingEvent) {
      return res.status(404).json({ error: "Entry not found." });
    }

    // Update the fields with the new data
    existingEvent.name = name || existingEvent.name;
    existingEvent.email = email || existingEvent.email;
    existingEvent.phoneNumber = phoneNumber || existingEvent.phoneNumber;
    existingEvent.referredBy = referredBy || existingEvent.referredBy;
    existingEvent.passCount = passCount || existingEvent.passCount;
    existingEvent.transactionNumber = transactionNumber || existingEvent.transactionNumber;

    // Save the updated BookStall document
    await existingEvent.save();

    // Return the updated stall data
    res.status(200).json(existingEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
