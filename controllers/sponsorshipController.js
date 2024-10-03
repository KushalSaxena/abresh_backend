// /controllers/sponsorshipController.js
const Sponsorship = require('../models/sponsorshipModel');

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
        res.status(201).json(savedSponsorship);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
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