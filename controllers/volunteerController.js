const Volunteer = require('../models/volunteerModel');
const crypto = require('crypto');  // To generate hash for color
const mongoose = require('mongoose');
const sendEmail = require('../utils/sendEmail');
const admin = require('../config/firebase'); // Firebase Admin SDK setup
const User = require('../models/userModel');

// Helper function to generate a color based on the volunteer's name
function generateColorFromName(name) {
  // Normalize the name: convert to lowercase and remove spaces
  const normalizedName = name.toLowerCase().replace(/\s+/g, '');

  // Create a hash from the normalized name using MD5
  const hash = crypto.createHash('md5').update(normalizedName).digest('hex');

  // Use the first 6 characters of the hash to create a valid hex color
  return `#${hash.substring(0, 6)}`;
}

// Create a new volunteer
exports.createVolunteer = async (req, res) => {
  try {
    // Step 1: Generate a consistent color based on the volunteer's name
    const volunteerColor = generateColorFromName(req.body.completeName);

    // Step 2: Save the volunteer to MongoDB with the assigned color
    const newVolunteer = new Volunteer({
      ...req.body,
      assignedColor: volunteerColor,  // Add color to the volunteer's data
    });

    await sendEmail(
      'artscape@abresh.com',                            // Sender email
      process.env.EMAIL_USER,                           // SMTP username for this sender
      process.env.EMAIL_PASS,                           // SMTP password for this sender
      newVolunteer.email,                                            // Receiver email
      'Welcome to the Team! Your Volunteer Role at ABR ArtScape is Confirmed! 🙌',  // Subject
      `Dear ${newVolunteer.completeName},\n\nCongratulations! 🎉 Your application to join us as a volunteer for ABR ArtScape in Hisar, Haryana, has been confirmed! Our team will now verify your details within the next 4 business hours, and once everything is set, you’ll receive a confirmation email to finalize your role. 🙌\n\nGet ready to immerse yourself in a world of art, creativity, and unforgettable memories! This is your chance to be part of something truly special—meeting new people, experiencing incredible art, and contributing to the success of one of the biggest festivals of the year! 🎨✨\n\nThank you so much for stepping up to be a part of the ABR ArtScape family. We can’t wait to welcome you to the festival on November 9th & 10th, 2024! Stay tuned for more details, and let’s make this event one to remember!\n\nBest,\nTeam ABResh Events`
    );
    const savedVolunteer = await newVolunteer.save();

    
    const abr = await User.find({ role: 'Admin' });

    // Extract FCM tokens from volunteers
    const tokens = abr.map(v => v.fcmToken).filter(Boolean);

    if (tokens.length) {
      const message = {
        notification: {
          title: 'New Volunteer Registration!',
          body: `${newVolunteer.completeName} has done registration`,
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
    // Step 8: Send success response to client
    res.status(201).json(savedVolunteer);
  } catch (error) {
    // Step 9: Handle errors (including missing required fields)
    res.status(400).json({ message: error.message });
  }
};

// Get all volunteers
exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get specific volunteer details (stall bookings, recruited volunteers, competition participants, and incentive)
exports.getVolunteerDetails = async (req, res) => {
  try {
    const { email } = req.params; // Get the email from the request params

    // Find the volunteer by email and select only the necessary fields
    const volunteer = await Volunteer.findOne({ email: email }, 'recruitedVolunteers competitionParticipants stallBookings incentiveEarned completeName email');

    // If volunteer not found, return 404
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    // Return the volunteer details
    res.status(200).json({ volunteer });
  } catch (error) {
    // Catch and return any errors that occur during fetching
    res.status(500).json({ message: error.message });
  }
};


// Get volunteer statistics by ID (recruitedVolunteers, competitionParticipants, stallBookings, incentiveEarned)
exports.getVolunteerStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    const volunteer = await Volunteer.findById(id, 'recruitedVolunteers competitionParticipants stallBookings incentiveEarned');

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.status(200).json(volunteer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update volunteer activity and calculate incentives
exports.updateVolunteerActivity = async (req, res) => {
  const { volunteerId } = req.params;
  const { recruitedVolunteers, competitionParticipants, stallBookings } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(volunteerId)) {
      return res.status(400).json({ message: 'Invalid volunteerId' });
    }

    if (typeof recruitedVolunteers !== 'number' || recruitedVolunteers < 0 ||
      typeof competitionParticipants !== 'number' || competitionParticipants < 0 ||
      typeof stallBookings !== 'number' || stallBookings < 0) {
      return res.status(400).json({ message: 'Invalid input values' });
    }

    let volunteerActivity = await Volunteer.findOne({ _id: volunteerId });

    if (!volunteerActivity) {
      return res.status(404).json({ message: 'Volunteer activity not found' });
    }

    const newReferredVolunteers = recruitedVolunteers ?? volunteerActivity.recruitedVolunteers;
    const newStallBookings = stallBookings ?? volunteerActivity.stallBookings;
    const newCompetitionParticipants = competitionParticipants ?? volunteerActivity.competitionParticipants;

    let incentive = calculateIncentive(newReferredVolunteers, newStallBookings, newCompetitionParticipants);

    volunteerActivity.recruitedVolunteers = newReferredVolunteers;
    volunteerActivity.stallBookings = newStallBookings;
    volunteerActivity.competitionParticipants = newCompetitionParticipants;
    volunteerActivity.incentiveEarned = incentive;

    await volunteerActivity.save();

    res.status(200).json({
      message: 'Volunteer activity updated successfully',
      activity: volunteerActivity,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate incentive
const calculateIncentive = (referredVolunteers, stallBookings, competitionParticipants) => {
  let incentive = 0;

  if (referredVolunteers > 5) {
    incentive += (referredVolunteers - 5) * 500;
  }

  if (competitionParticipants > 5) {
    incentive += (competitionParticipants - 5) * 100;
  }

  if (stallBookings > 0) {
    incentive += stallBookings * (10/100);
  }

  return incentive;
};

// Delete a volunteer by ID
exports.deleteVolunteerById = async (req, res) => {
  try {
    const deletedVolunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!deletedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.status(200).json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update specific fields of a volunteer
exports.updateVolunteer = async (req, res) => {
  try {
    // Extract the volunteer ID from the request parameters
    const volunteerId = req.params.volunteerId;

    // Define the fields allowed for update from the request body
    const allowedUpdates = {
      completeName : req.body.completeName,
      email : req.body.email,
      gender : req.body.gender,
      dob : req.body.dob,
      pincode : req.body.pincode,
      mobile: req.body.mobile,
      alternateNumber : req.body.alternateNumber,
      profession: req.body.profession,
      institute: req.body.institute,
      referredBy : req.body.referredBy,
      interviewBy : req.body.interviewBy,
      interviewStatus : req.body.interviewStatus,
      stallStatus: req.body.stallStatus,
      referredPass : req.body.referredPass
    };

    // Remove undefined or null fields from the update object
    Object.keys(allowedUpdates).forEach(key => {
      if (allowedUpdates[key] === undefined || allowedUpdates[key] === null) {
        delete allowedUpdates[key];  // Exclude fields that are not changed
      }
    });

    // Ensure there is at least one field to update
    if (Object.keys(allowedUpdates).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Find the volunteer by ID and update only the allowed fields
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      volunteerId,
      { $set: allowedUpdates },  // Only update with allowed fields
      { new: true, runValidators: true }  // Return updated document and validate
    );

    // If volunteer not found, return an error
    if (!updatedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    // Send the updated volunteer as the response
    res.status(200).json(updatedVolunteer);
  } catch (error) {
    // Handle any errors
    res.status(400).json({ message: error.message });
  }
};

