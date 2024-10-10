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
            referredBy,
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
            referredBy,
            category,
            description,
            link,
            specialRequest,
            boothSize,
            transactionNumber,
            staffAttending,
            eventId,
            location: { city: location.city, date: location.date },
            isDisclaimer: isDeclarationChecked  // Store city and date directly
        });

        await newBookStall.save();
        await sendEmail(
            'artscape@abresh.com',                            // Sender email
            process.env.EMAIL_USER,                           // SMTP username for this sender
            process.env.EMAIL_PASS,                           // SMTP password for this sender
            email,                                            // Receiver email
            'Congratulations! Your Stall Booking Application Received at ABR ArtScape!',  // Subject
            `Dear ${name},\n\nWe’re beyond excited to let you know that your stall booking application for ABR ArtScape in Hisar, Haryana, has been successfully received! 🎉 Our team will review and verify your details and payment within the next 4 business hours. Once everything is set, you’ll receive a final confirmation along with all the essential guidelines to make your booth shine! ✨\n\nGet ready to showcase your creativity, connect with thousands of art lovers, and make your mark at one of the biggest art festivals in the region! 🎨\n\nThank you for choosing ABR ArtScape! We can’t wait to see your work in action! Don’t forget to spread the word and invite others to join this creative celebration!\n\nBest,\nTeam ABResh Events`
        );        
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

exports.updateBookStall = async (req, res) => {
    try {
        const {
            name,
            email,
            phoneNumber,
            referredBy,
            category,
            description,
            link,
            specialRequest,
            boothSize,
            transactionNumber,
            staffAttending,
        } = req.body;

        const { stallId } = req.params; // Extract stallId from req.params

        // Check if the stallId is provided
        if (!stallId) {
            return res.status(400).json({ error: "Stall ID is required." });
        }

        // Find the existing BookStall entry by ID
        const existingStall = await BookStall.findById(stallId);

        if (!existingStall) {
            return res.status(404).json({ error: "Stall not found." });
        }

        // Update the fields with the new data
        existingStall.name = name || existingStall.name;
        existingStall.email = email || existingStall.email;
        existingStall.phoneNumber = phoneNumber || existingStall.phoneNumber;
        existingStall.referredBy = referredBy || existingStall.referredBy;
        existingStall.category = category || existingStall.category;
        existingStall.description = description || existingStall.description;
        existingStall.link = link || existingStall.link;
        existingStall.specialRequest = specialRequest || existingStall.specialRequest;
        existingStall.boothSize = boothSize || existingStall.boothSize;
        existingStall.transactionNumber = transactionNumber || existingStall.transactionNumber;
        existingStall.staffAttending = staffAttending || existingStall.staffAttending;

        // Save the updated BookStall document
        await existingStall.save();        

        // Return the updated stall data
        res.status(200).json(existingStall);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
