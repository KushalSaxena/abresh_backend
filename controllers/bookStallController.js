const BookStall = require('../models/bookStallModel');
const sendEmail = require('../utils/sendEmail');


// POST: Create a new book stall entry
exports.createBookStall = async (req, res) => {
    try {
        const {
            name,
            email,
            phoneNumber,
            alternateNumber,
            gender,
            category,
            description,
            link,
            specialRequest,
            boothSize,
            transactionNumber,
            staffAttending,
            eventId,
            location,
            isDeclarationChecked,
        } = req.body;

        if (!isDeclarationChecked) {
            return res.status(400).json({ error: "Declaration must be accepted." });
        }

        const newBookStall = new BookStall({
            name,
            email,
            phoneNumber,
            alternateNumber,
            gender,
            category,
            description,
            link,
            specialRequest,
            boothSize,
            transactionNumber,
            staffAttending,
            eventId,
            location: { city: location.city, date: location.date },
            isDisclaimer : isDeclarationChecked  // Store city and date directly
        });

        await newBookStall.save();
        // await sendEmail(
        //     'artscape@abresh.com',              // Sender email
        //     process.env.EMAIL_USER,     // SMTP username for this sender
        //     process.env.EMAIL_PASS,     // SMTP password for this sender
        //     email,                            // Receiver email
        //     'Confirmation: Book Stall Registration', // Subject
        //     `Hello ${name},\n\nYour book stall  registration has been successfully submitted for ${location.city} on ${location.date}. \nTransaction Number: ${transactionNumber}\n\nThank you!`
        //   );
        res.status(201).json(newBookStall);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// GET: Retrieve all book stall entries
exports.getBookStalls = async (req, res) => {
    try {
        const bookStalls = await BookStall.find();
        res.status(200).json(bookStalls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Remove a book stall by ID
exports.deleteBookStall = async (req, res) => {
    try {
        const bookStallId = req.params.id;
        const deletedBookStall = await BookStall.findByIdAndDelete(bookStallId);

        if (!deletedBookStall) {
            return res.status(404).json({ error: 'Book stall not found' });
        }

        res.status(200).json({ message: 'Book stall deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
