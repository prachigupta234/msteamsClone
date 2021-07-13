const mongoose = require('mongoose');

//user database schema
const userSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    phoneNumber:{
        type: Number,
        unique: true
    },
    name: String,
    password: String,
    // continue;
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;