const EventRegister = require('../models/eventRegistrationModel');
const sendEmail = require('../utils/sendEmail');


exports.eventRegister = async (req, res) => {
    try {
        const {
            eventCategory,
            name,
            dateOfBirth,
            email,
            phoneNumber,
            mailingAddress,
            theme,
            description,
            specialRequest,
            transactionNumber,
            eventId,
            location,
            isDeclarationChecked,
        } = req.body;

        if (!isDeclarationChecked) {
            return res.status(400).json({ error: "Declaration must be accepted." });
        }

        const newEventRegister = new EventRegister({
            eventCategory,
            name,
            dateOfBirth,
            email,
            phoneNumber,
            mailingAddress,
            theme,
            description,
            specialRequest,
            transactionNumber,
            eventId,
            location: { city: location.city, date: location.date },
            isDeclarationChecked  // Store city and date directly
        });

        const saveEventRegister = await newEventRegister.save();
        // await sendEmail(
        //     'registration@abresh.com',              // Sender email
        //     process.env.EMAIL_USER,     // SMTP username for this sender
        //     process.env.EMAIL_PASS,     // SMTP password for this sender
        //     email,                            // Receiver email
        //     'Confirmation: Event Participation Registration', // Subject
        //     `Hello ${name},\n\nYour event participation registration has been successfully submitted for ${location.city} on ${location.date}. \nTransaction Number: ${transactionNumber}\n\nThank you!`
        //   );
        res.status(200).json(saveEventRegister);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all event registrations
exports.getAllEventRegistrations = async (req, res) => {
    try {
        const eventRegistrations = await EventRegister.find();  // Fetch all registrations
        res.status(200).json(eventRegistrations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete event registration by ID
exports.deleteEventRegistration = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedEventRegistration = await EventRegister.findByIdAndDelete(id);
        
        if (!deletedEventRegistration) {
            return res.status(404).json({ error: 'Event registration not found' });
        }

        res.status(200).json({ message: 'Event registration deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
