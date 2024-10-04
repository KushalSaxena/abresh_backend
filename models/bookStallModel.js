const mongoose = require('mongoose');

const bookStallSchema = new mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String, required: true},
    phoneNumber : {type : Number, required: true},
    alternateNumber : {type : Number},
    gender : {type : String, required: true},
    referredBy : {type : String},
    category : {type : String, required: true},
    description : {type : String, required : true},
    link : {type: String, required: true},
    specialRequest : {type : String},
    boothSize : {type : String, required: true},
    transactionNumber : {type : String, required : true},
    staffAttending : {type: String, required: true},
    eventId: { type: 'String', required: true },  // Reference to the Event
    location: {  // Embedded location data (city and date)
      city: { type: String, required: true },
      date: { type: String, required: true }
    },
    isDisclaimer : {type : Boolean, required : true}
});

const BookStall = mongoose.model('BookStall', bookStallSchema);
module.exports = BookStall;

