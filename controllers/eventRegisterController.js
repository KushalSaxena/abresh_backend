const EventRegister = require('../models/eventRegistrationModel');
const sendEmail = require('../utils/sendEmail');


exports.eventRegister = async (req, res) => {
    try {
        const {
            eventCategory,
            name,
            dateOfBirth,
            gender,
            email,
            phoneNumber,
            alternateNumber,
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
            gender,
            email,
            phoneNumber,
            alternateNumber,
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
        await sendEmail(
            'registration@abresh.com',              // Sender email
            process.env.EMAIL_USER,                 // SMTP username for this sender
            process.env.EMAIL_PASS,                 // SMTP password for this sender
            email,                                  // Receiver email
            'Your Participation at ABR ArtScape is Almost Set—Get Ready to Shine! 🌟', // Subject
            `Dear ${name},
          
          We are thrilled to announce that your participation application for ABR ArtScape in Hisar, Haryana, has been successfully received! 🎉 Our team will now review your details and payment within the next 4 business hours. Once everything is confirmed, you’ll receive a final confirmation and all the important guidelines to help you prepare for the event within another 4 business hours!
          
          In the meantime, why not share some of your creative work with us? Whether it’s designs, video clips, or anything that showcases your artistic flair, we’d love to see it and keep it for our records! 🎨📸
          
          This is your time to shine—so use this time to practice, perfect your skills, and get ready to make a lasting impact on stage. 🚀 This could be the opportunity that opens doors to endless possibilities, and we can’t wait to see you bring your A-game!
          
          Thanks for being a part of ABR ArtScape, and stay tuned for your final confirmation. The spotlight is waiting for you!
          
          Best,
          Team ABResh Events`
          );
          
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
