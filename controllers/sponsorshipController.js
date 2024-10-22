// /controllers/sponsorshipController.js
const Sponsorship = require('../models/sponsorshipModel');
const sendEmail = require('../utils/sendEmail');
const admin = require('../config/firebase'); // Firebase Admin SDK setup
const User = require('../models/userModel');
// Handle form submission
exports.createSponsorship = async (req, res) => {
    try {
        const {
            companyName,
            contactPerson,
            designation,
            email,
            phone,
            mailingAddress,
            sponsorshipLevel,
            additionalRequests,
            paymentTerms,
            declarationAccepted,
            eventId,
            location
        } = req.body;

        if (!declarationAccepted) {
            return res.status(400).json({ error: 'Declaration must be accepted.' });
        }
        
        const newSponsorship = new Sponsorship({
            companyName,
            contactPerson,
            designation,
            email,
            phone,
            mailingAddress,
            sponsorshipLevel,
            additionalRequests,
            paymentTerms,
            declarationAccepted,
            eventId,
            location: { city: location.city, date : location.date }  // Store city and date directly
        });

        const savedSponsorship = await newSponsorship.save();

        await sendEmail(
            'partner@abresh.com',              // Sender email
            process.env.EMAIL_USER,                 // SMTP username for this sender
            process.env.EMAIL_PASS,                 // SMTP password for this sender
            email,                                  // Receiver email
            'Thank You for Your Interest in Sponsoring ABR ArtScape 2024! 🌟', // Subject
            `Dear ${companyName},\n\n We are beyond thrilled to have received your interest in sponsoring ABR ArtScape 2024 in Hisar, Haryana! 🌟 Your support means a great deal to us, and we can’t wait to explore how your brand can shine at one of the most exciting art festivals of the year.\n\nAn authorized representative from ABResh Events will be in touch with you within the next 4 business hours to discuss your sponsorship opportunity and answer any questions you might have. Get ready for a fantastic partnership that will not only promote your brand but also support a celebration of creativity and talent!\n\nIn the meantime, feel free to dive into the world of ABR ArtScape through our [website/social media links] to explore what makes this festival so special. We’re sure you’ll love what you see!\n\nIf you have any special requests or questions before we connect, don't hesitate to reach out—we’re here to help!\n\nThank you once again for considering this incredible opportunity. We look forward to partnering with you to make ABR ArtScape 2024 truly unforgettable!\n\nWarm regards,\nABResh Events Team`
          );
          
          const abr = await User.find({ role: 'Admin' });

          // Extract FCM tokens from volunteers
          const tokens = abr.map(v => v.fcmToken).filter(Boolean);
      
          if (tokens.length) {
            const message = {
              notification: {
                title: 'New Sponsor!',
                body: `${companyName}`,
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
              res.status(201).json(savedSponsorship);
          } catch (error) {
              res.status(400).json({ error: error.message });
          }
};


// Get all sponsorships for an event
exports.getSponsorshipsByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const sponsorships = await Sponsorship.find({ eventId });
        res.status(200).json(sponsorships);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteSponsorship = async (req, res) => {
    try {
        const { id } = req.params;

        const sponsorship = await Sponsorship.findByIdAndDelete(id);
        
        if (!sponsorship) {
            return res.status(404).json({ error: 'Sponsorship not found' });
        }

        res.status(200).json({ message: 'Sponsorship deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllSponsors = async (req, res) => {
    try {
        const sponsors = await Sponsorship.find();
        res.status(200).json(sponsors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateSponsor = async (req, res) => {
    try {
        const { id } = req.params;  // Get the id from request params

        // Get all fields from the request body
        const {
            companyName,
            contactPerson,
            designation,
            email,
            phone,
            mailingAddress,
            sponsorshipLevel,
            additionalRequests,
            paymentTerms,
        } = req.body;

        // Find the registration by id and update it with the new details
        const updatedSponsor = await Sponsorship.findByIdAndUpdate(
            id,  // The id of the event registration to be updated
            {
                companyName,
                contactPerson,
                designation,
                email,
                phone,
                mailingAddress,
                sponsorshipLevel,
                additionalRequests,
                paymentTerms,
            },
            { new: true }  // Return the updated document
        );

        // If event registration is not found, send an error
        if (!updatedSponsor) {
            return res.status(404).json({ error: "Sponsor not found" });
        }

        // Send the updated event registration details in the response
        res.status(200).json(updatedSponsor);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
