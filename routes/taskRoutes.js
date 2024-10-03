const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/tasks', taskController.submitUserRequest); // Submit User Request
router.get('/tasks',taskController.getTasks);

module.exports = router;
