// /routes/sponsorshipRoutes.js
const express = require('express');
const router = express.Router();
const sponsorshipController = require('../controllers/sponsorshipController');

// POST: Create a sponsorship
router.post('/sponsorship', sponsorshipController.createSponsorship);

// GET: Fetch all sponsorships by event
router.delete('/sponsorships/:id', sponsorshipController.deleteSponsorship);

// Route to get all sponsors
router.get('/sponsorships', sponsorshipController.getAllSponsors);

module.exports = router;
