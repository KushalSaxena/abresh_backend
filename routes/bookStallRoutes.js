const express = require('express');
const router = express.Router();
const bookStallController = require('../controllers/bookStallController');
const authenticateUser = require('../middlewares/authenticateUser');
const isAdmin = require('../middlewares/isAdmin');

// POST route to create a new book stall
router.post('/bookStall', bookStallController.createBookStall);

// GET route to retrieve all book stalls
router.get('/bookStalls', bookStallController.getBookStalls);

// DELETE route to remove a specific book stall by ID
router.delete('/bookStall/:id', authenticateUser, isAdmin, bookStallController.deleteBookStall);

router.put('/bookstall/update/:stallId', authenticateUser, isAdmin, bookStallController.updateBookStall);

module.exports = router;
