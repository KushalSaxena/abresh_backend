// /routes/sponsorshipRoutes.js
const express = require('express');
const router = express.Router();
const eventEntryController = require('../controllers/eventEntryController');
const authenticateUser = require('../middlewares/authenticateUser');
const isAdmin = require('../middlewares/isAdmin');

// POST: Create a sponsorship
router.post('/event/entry', eventEntryController.eventEntry);

// GET route to fetch all event entries
router.get('/event/entry', eventEntryController.getEventEntries);


// DELETE route to delete an event entry by ID
router.delete('/event/entry/:id', authenticateUser, isAdmin,eventEntryController.deleteEventEntry);

router.put('/event/entry/:eventId', authenticateUser, isAdmin,eventEntryController.updateEventEntry);

module.exports = router;
