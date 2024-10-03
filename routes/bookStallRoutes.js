const express = require('express');
const router = express.Router();
const bookStallController = require('../controllers/bookStallController');

// POST route to create a new book stall
router.post('/bookStall',bookStallController.createBookStall);

// GET route to retrieve all book stalls
router.get('/bookStalls', bookStallController.getBookStalls);

// DELETE route to remove a specific book stall by ID
router.delete('/bookStall/:id', bookStallController.deleteBookStall);

module.exports = router;
