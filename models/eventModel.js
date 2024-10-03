const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    city:{
        type : String,
        required : true
    },
    date:{
        type : String
    },
    poster:{
        type : String
    }
});

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;