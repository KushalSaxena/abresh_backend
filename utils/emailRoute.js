const express = require('express');
const sendEmail = require('./sendEmail');
const multer = require('multer');
const path = require('path');  // Import your email sending function
const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');  // Directory where files will be stored
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);  // File name format with timestamp
        },
    }),
    fileFilter: (req, file, cb) => {
        // Allowed MIME types
        const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/octet-stream'];

        // Check MIME type
        if (allowedMimeTypes.includes(file.mimetype)) {
            // Validate based on extension when the MIME type is `application/octet-stream`
            const ext = path.extname(file.originalname).toLowerCase();
            const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '/octet-stream'];

            // Allow file if extension matches the allowed list
            if (allowedExtensions.includes(ext)) {
                cb(null, true);
            } else {
                cb(new Error('Only PDF and JPG/PNG files are allowed'), false);
            }
        } else {
            cb(new Error('Only PDF and JPG/PNG files are allowed'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024  // Optional file size limit (5MB in this case)
    }
});
// POST route to send an email
router.post('/send-email-bookstall', async (req, res) => {
    const { name, email } = req.body;

    try {
        // Create the email body content
        const emailText = `Dear ${name},\n\nFantastic news! 🎉 Your stall booking for ABR ArtScape in Hisar, Haryana, has been confirmed! We’ve successfully verified all your details and received your payment—you're officially part of this incredible art festival! 🙌\n\nGet ready to showcase your amazing products and connect with over 10,000 art enthusiasts, creatives, and shoppers from all around. This is your chance to make a mark, inspire others, and leave an unforgettable impression!\n\nThank you for being a part of ABR ArtScape. We can’t wait to see your stall come to life! Spread the word, and let's create magic together! 🎨✨\n\nBest regards,\nTeam ABResh Events`;

        // Call the sendEmail function
        await sendEmail(
            'artscape@abresh.com',              // Sender email (from address)
            process.env.EMAIL_USER,                 // SMTP username from .env file
            process.env.EMAIL_PASS,                 // SMTP password from .env file
            email,                                  // Receiver email address
            '🎉 Congratulations! Your Stall is Booked for ABR ArtScape! 🎨🎶',
            emailText,// Email subject emailText                             
        );

        // Send a success response
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        // Send an error response
        res.status(500).json({ message: 'Failed to send email', error });
    }
});

router.post('/send-email-entry', upload.single('attachment'), async (req, res) => {
    const { name, email } = req.body;
    const attachment = req.file; // Get the uploaded file from multer

    try {
        // Create the email body content
        const emailText = `Dear ${name},\n\nWoohoo! 🎉 We're excited to confirm that your entry pass purchase for ABR ArtScape has been successfully processed! Your details have been verified, and your payment has been received—you're all set to experience two days of creativity, music, food, and fun in Hisar, Haryana!\n\nTicket enclosed.\n\nGet ready to immerse yourself in an unforgettable celebration of art, culture, and community. Share the excitement with your friends and family, and let’s make this event even bigger and brighter! 🌟\n\nWe can’t wait to welcome you to ABR ArtScape on November 9th-10th. Thank you for being part of this extraordinary journey!\n\nBest regards,\nTeam ABResh Events`;

        // Call the sendEmail function
        await sendEmail(
            'ticket@abresh.com',              // Sender email (from address)
            process.env.EMAIL_USER,                 // SMTP username from .env file
            process.env.EMAIL_PASS,                 // SMTP password from .env file
            email,                                  // Receiver email address
            '🎟 You’re In! Your Entry Pass for ABR ArtScape is Confirmed! 🎉',
            emailText,
            attachment ? [{                     // Attachments array (if present)
                filename: attachment.originalname,
                path: attachment.path,
                contentType: attachment.mimetype,
            }] : []   // Email subject emailText                               // Email body content
        );

        // Send a success response
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        // Send an error response
        res.status(500).json({ message: 'Failed to send email', error });
    }
});

router.post('/send-email-participate', async (req, res) => {
    const { name, email } = req.body;

    try {
        // Create the email body content
        const emailText = `Dear ${name},\n\nCongratulations! 🎉 Your participation in ABR ArtScape in Hisar, Haryana, has been officially accepted! We’ve successfully verified your details, and your payment is confirmed. Your talent in [Category: Painting/Photography/Nukkad Natak/Poetry/Open Mic] will light up the festival and inspire countless attendees!\n\nThis is your moment to shine and make a lasting impact with your creativity. We believe your unique voice and art will be a highlight of the festival, and we can't wait to witness it all unfold!\n\nThank you for being part of ABR ArtScape. Get ready to leave your artistic mark—practice, prepare, and let's make this an unforgettable celebration of creativity!\n\nBest regards,\nTeam ABResh Events`;

        // Call the sendEmail function
        await sendEmail(
            'registration@abresh.com',              // Sender email (from address)
            process.env.EMAIL_USER,                 // SMTP username from .env file
            process.env.EMAIL_PASS,                 // SMTP password from .env file
            email,                                  // Receiver email address
            '🚀 You’re In! Your Participation at ABR ArtScape is Confirmed! 🚀',
            emailText // Email subject emailText                               // Email body content
        );

        // Send a success response
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        // Send an error response
        res.status(500).json({ message: 'Failed to send email', error });
    }
});

router.post('/send-email-volunteer', async (req, res) => {
    const { name, email } = req.body;

    try {
        // Create the email body content
        const emailText = `Dear ${name},\n\nA massive congratulations and a warm welcome to the team! 🎉 Your volunteer application for ABR ArtScape has been accepted, and your spot is officially confirmed! 🙌 We’re beyond excited to have you with us as we bring this extraordinary festival to life in Hisar, Haryana.\n\nYour energy, dedication, and passion will play a vital role in making ABR ArtScape a huge success. Get ready to meet amazing people, experience the magic of art and culture, and create memories that will last a lifetime!\n\nThank you for stepping up to be a part of something special. We’re counting on your enthusiasm to help make this event unforgettable. Let’s make history together! 🎨🎶\n\nBest regards,\nTeam ABResh Events`;

        // Call the sendEmail function
        await sendEmail(
            'artscape@abresh.com',              // Sender email (from address)
            process.env.EMAIL_USER,                 // SMTP username from .env file
            process.env.EMAIL_PASS,                 // SMTP password from .env file
            email,                                  // Receiver email address
            '🙌 You’re Officially a Volunteer for ABR ArtScape! Welcome Aboard! 🙌',
            emailText // Email subject emailText                               // Email body content
        );

        // Send a success response
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        // Send an error response
        res.status(500).json({ message: 'Failed to send email', error });
    }
});

router.post('/send-email-incorrect-info', async (req, res) => {
    const { name, email } = req.body;

    try {
        // Create the email body content for incorrect information notification
        const emailText = `Dear ${name},\n\nUnfortunately, it seems that certain details were not accurate or incomplete. We kindly request that you review your submission and provide the correct details as soon as possible.\n\nShould you require any assistance, do not hesitate to reach out us at support@abresh.com.\n\nBest regards,\nTeam ABResh Events`;

        // Call the sendEmail function to send the email
        await sendEmail(
            'support@abresh.com',                 // Sender email (from address)
            process.env.EMAIL_USER,               // SMTP username from .env file
            process.env.EMAIL_PASS,               // SMTP password from .env file
            email,                                // Receiver email address
            '⚠️ Action Required: Incorrect Information for ABR ArtScape',  // Subject
            emailText                             // Email body content
        );

        // Send a success response
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        // Send an error response
        res.status(500).json({ message: 'Failed to send email', error });
    }
});


module.exports = router;
