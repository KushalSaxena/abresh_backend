const Volunteer = require('../models/volunteerModel');
const crypto = require('crypto');  // To generate hash for color
const mongoose = require('mongoose');

// Helper function to generate a color based on the volunteer's name
function generateColorFromName(name) {
  // Create a hash from the name using SHA-256 (or another algorithm)
  const hash = crypto.createHash('md5').update(name).digest('hex');

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

    const savedVolunteer = await newVolunteer.save();

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

