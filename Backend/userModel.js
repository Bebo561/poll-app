const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        required: true,
        type: String
    }, 
    password:{
        required: true,
        type: String
    }
});

var userModel = mongoose.model('user', userSchema);

module.exports = userModel;