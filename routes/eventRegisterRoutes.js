const express = require('express');
const router = express.Router();
const eventRegisterController = require('../controllers/eventRegisterController');

// POST: Create a sponsorship
router.post('/event/register', eventRegisterController.eventRegister);

// Get all event registrations
router.get('/event/register', eventRegisterController.getAllEventRegistrations);

// Delete an event registration by ID
router.delete('/event/register/:id', eventRegisterController.deleteEventRegistration);
module.exports = router;
