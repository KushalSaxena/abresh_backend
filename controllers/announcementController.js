const Announcement = require('../models/announcementModel');
const User = require('../models/userModel');
const admin = require('../config/firebase'); // Firebase Admin SDK setup

// Submit New User Request (Create Task)
exports.submitUserRequest = async (req, res) => {
  try {
    const { username, userRequest } = req.body;

    console.log('Received user request:', { username, userRequest });

    // Create a new announcement and save it to the database
    const newAnnouncement = new Announcement({ username, userRequest });
    await newAnnouncement.save();

    console.log('Announcement saved:', newAnnouncement);

    // Fetch all volunteers from the database
    const volunteers = await User.find({ role: 'Volunteer' });

    // Extract FCM tokens from volunteers
    const tokens = volunteers.map(v => v.fcmToken).filter(Boolean);

    if (tokens.length) {
      const message = {
        notification: {
          title: 'New Announcement!',
          body: `Admin posted: ${userRequest}`,
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

    res.status(201).json({ message: 'Announcement created, volunteers notified' });
  } catch (error) {
    console.error('Error occurred while submitting user request:', error.message);
    res.status(500).json({ message: error.message });
  }
};


// Get All Tasks (Retrieve all tasks)
exports.getAnnoucement = async (req, res) => {
  try {
    // Fetch all tasks from the database
    const announcement = await Announcement.find();

    // Respond with the list of tasks
    res.status(200).json({
      message: 'Tasks fetched successfully',
      announcement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the announcement by ID
    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error occurred while deleting announcement:', error.message);
    res.status(500).json({ message: error.message });
  }
};