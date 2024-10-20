const mongoose = require('mongoose');

const eventRegisterSchema = new mongoose.Schema({
    eventCategory : {type : String, required : true},
    options : {type : String, required : true},
    name : {type : String, required : true},
    dateOfBirth : {type : String, required: true},
    gender : {type : String, required : true},
    email : {type : String, required: true},
    phoneNumber : {type : Number, required: true},
    alternateNumber : {type : Number},
    mailingAddress : {type : String, required : true},
    theme : {type : String, required : true},
    description : {type : String, required : true},
    specialRequest : {type : String},
    transactionNumber : {type : String, required : true},
    eventId: { type: 'String', required: true },  // Reference to the Event
    location: {  // Embedded location data (city and date)
      city: { type: String, required: true },
      date: { type: String, required: true }
    },
    isDeclarationChecked : {type : Boolean, required : true},
});

module.exports = mongoose.model('EventRegister', eventRegisterSchema);