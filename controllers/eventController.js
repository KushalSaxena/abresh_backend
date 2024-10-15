const mongoose = require('mongoose');
const Event = require('../models/eventModel.js');


exports.createEvent = async (req,res) =>{
    const {city, date, poster} = req.body;
    
    const event = new Event({city,date,poster});
    await event.save();
    res.status(200).json(event);
};

exports.getAllEvents = async (req, res) => {
    try {
      const events = await Event.find();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };