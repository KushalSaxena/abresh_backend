const express = require('express');
const { createEvent, getAllEvents } = require('../controllers/eventController.js');
const router = express.Router();

router.post('/create/event', createEvent);
router.get('/get/events', getAllEvents)

module.exports = router;