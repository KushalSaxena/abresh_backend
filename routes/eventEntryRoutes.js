// /routes/sponsorshipRoutes.js
const express = require('express');
const router = express.Router();
const eventEntryController = require('../controllers/eventEntryController');

// POST: Create a sponsorship
router.post('/event/entry', eventEntryController.eventEntry);

// GET route to fetch all event entries
router.get('/event/entry', eventEntryController.getEventEntries);


// DELETE route to delete an event entry by ID
router.delete('/event/entry/:id', eventEntryController.deleteEventEntry);

router.put('/event/entry/:eventId', eventEntryController.updateEventEntry);

module.exports = router;
