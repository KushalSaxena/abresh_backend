const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

router.post('/announcement', announcementController.submitUserRequest); // Submit User Request
router.get('/announcement',announcementController.getAnnoucement);

module.exports = router;