const Task = require('../models/taskModel');
const admin = require('../config/firebase'); // Firebase Admin SDK setup
const User = require('../models/userModel');

// Submit New User Request (Create Task)
exports.submitUserRequest = async (req, res) => {
  try {
    const { email, userRequest } = req.body;

    // Create a new task document
    const newTask = new Task({
      email,        // The user submitting the request
      userRequest,     // The actual user request or task details
    });

    // Save the new task to the database
    const savedTask = await newTask.save();
    
    const abr = await User.find({ role: 'Admin' });

    // Extract FCM tokens from volunteers
    const tokens = abr.map(v => v.fcmToken).filter(Boolean);

    if (tokens.length) {
      const message = {
        notification: {
          title: 'Volunteer Request!',
          body: `${email} has requested for ${userRequest}`,
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
    // Respond with the newly created task
    res.status(201).json({
      message: 'User request created successfully',
      task: savedTask,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get All Tasks (Retrieve all tasks)
exports.getTasks = async (req, res) => {
  try {
    // Fetch all tasks from the database
    const tasks = await Task.find();
    
    // Respond with the list of tasks
    res.status(200).json({
      message: 'Tasks fetched successfully',
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
