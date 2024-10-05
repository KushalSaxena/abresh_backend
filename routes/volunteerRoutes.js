const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

// CRUD Routes for Volunteer form
router.post('/volunteers', volunteerController.createVolunteer);          // Create Volunteer
router.get('/volunteers', volunteerController.getAllVolunteers);          // Get All Volunteers
router.put('/volunteer/:volunteerId/update', volunteerController.updateVolunteerActivity);   // Update Volunteer by ID
router.delete('/volunteers/:id', volunteerController.deleteVolunteerById);// Delete Volunteer by ID
router.get('/volunteer/:id/statistics', volunteerController.getVolunteerStatistics);
router.put('/volunteers/:volunteerId/update', volunteerController.updateVolunteer);
router.get('/volunteers/:id/details', volunteerController.getVolunteerDetails);



module.exports = router;
