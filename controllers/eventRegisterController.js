const EventRegister = require('../models/eventRegistrationModel');
const sendEmail = require('../utils/sendEmail');
const admin = require('../config/firebase'); // Firebase Admin SDK setup
const User = require('../models/userModel');

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
         
          const abr = await User.find({ role: 'Admin' });

          // Extract FCM tokens from volunteers
          const tokens = abr.map(v => v.fcmToken).filter(Boolean);
      
          if (tokens.length) {
            const message = {
              notification: {
                title: 'Event Participation!',
                body: `${name} has participated in the event`,
              },
              tokens, // List of FCM tokens
            };
      
            console.log('Prepared FCM message:', message);
      
            // Send the notification to multiple devices
            const response = await admin.messaging().sendEachForMulticast(message);
            console.log('Notification send response:', response);
      
            // Log detailed errors for failed tokens
            response.responses.forEach((resp, idx) => {
              if (!resp.success) {
                console.error(`Failed to send to token: ${tokens[idx]}`, resp.error);
              }
            });
      
          } else {
            console.log('No valid FCM tokens found.');
          }  
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

exports.updateEventRegister = async (req, res) => {
    try {
        const { id } = req.params;  // Get the id from request params

        // Get all fields from the request body
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
        } = req.body;

        // Find the registration by id and update it with the new details
        const updatedEventRegister = await EventRegister.findByIdAndUpdate(
            id,  // The id of the event registration to be updated
            {
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
            },
            { new: true }  // Return the updated document
        );

        // If event registration is not found, send an error
        if (!updatedEventRegister) {
            return res.status(404).json({ error: "Event registration not found" });
        }        

        // Send the updated event registration details in the response
        res.status(200).json(updatedEventRegister);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
