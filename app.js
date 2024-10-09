// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const sponsorshipRoutes = require('./routes/sponsorshipRoutes');
const eventEntryRoutes = require('./routes/eventEntryRoutes');
const eventRegisterRoutes = require('./routes/eventRegisterRoutes');
const bookStallRoutes = require('./routes/bookStallRoutes');
const taskRoutes = require('./routes/taskRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const emailRoute = require('./utils/emailRoute');
const cors = require('cors');


dotenv.config();
connectDB();


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', eventRoutes);
app.use('/api', sponsorshipRoutes);
app.use('/api', eventEntryRoutes);
app.use('/api', eventRegisterRoutes);
app.use('/api', bookStallRoutes);
app.use('/api', volunteerRoutes);  // All volunteer-related routes prefixed with /api
app.use('/api', taskRoutes);  
app.use('/api',announcementRoutes);
app.use('/api', emailRoute);  // Register the email route under /api path



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
