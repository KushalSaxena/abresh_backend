const express = require('express');
const router = express.Router();
const eventRegisterController = require('../controllers/eventRegisterController');
const authenticateUser = require('../middlewares/authenticateUser');
const isAdmin = require('../middlewares/isAdmin');

// POST: Create a sponsorship
router.post('/event/register', eventRegisterController.eventRegister);

// Get all event registrations
router.get('/event/register', eventRegisterController.getAllEventRegistrations);

// Delete an event registration by ID
router.delete('/event/register/:id', authenticateUser, isAdmin,eventRegisterController.deleteEventRegistration);

router.put('/event-register/update/:id', authenticateUser, isAdmin,eventRegisterController.updateEventRegister);

module.exports = router;
