const Task = require('../models/taskModel');

// Submit New User Request (Create Task)
exports.submitUserRequest = async (req, res) => {
  try {
    const { username, userRequest } = req.body;

    // Create a new task document
    const newTask = new Task({
      username,        // The user submitting the request
      userRequest,     // The actual user request or task details
    });

    // Save the new task to the database
    const savedTask = await newTask.save();

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
