const mongoose = require('mongoose');

var pollSchema = new mongoose.Schema({
    pollName:{
        required: true,
        type: String
    },
    Option1:{
        required: true,
        type: String
    },
    numOfVotes1:{
        required: true,
        type: Number
    },
    Option2:{
        required: true,
        type: String
    },
    numOfVotes2:{
        required: true,
        type: Number
    },
    Option3:{
        required: true,
        type: String
    },
    numOfVotes3:{
        required: true,
        type: Number
    },
    Voted:{
        required: false,
        type: Array
    },
    Admin:{
        required: true,
        type: [String]
    }
});

var pollModel = mongoose.model('poll', pollSchema);

module.exports = pollModel;