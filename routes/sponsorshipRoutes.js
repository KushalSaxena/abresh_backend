// /routes/sponsorshipRoutes.js
const express = require('express');
const router = express.Router();
const sponsorshipController = require('../controllers/sponsorshipController');
const authenticateUser = require('../middlewares/authenticateUser');
const isAdmin = require('../middlewares/isAdmin');
// POST: Create a sponsorship
router.post('/sponsorship', sponsorshipController.createSponsorship);

// GET: Fetch all sponsorships by event
router.delete('/sponsorships/:id', sponsorshipController.deleteSponsorship);

// Route to get all sponsors
router.get('/sponsorships', sponsorshipController.getAllSponsors);

router.put('/sponsor/update/:id', authenticateUser, isAdmin, sponsorshipController.updateSponsor);

module.exports = router;
