const mongoose = require("mongoose");

const usersModel = new mongoose.Schema({
    email: {
        type: String,
        length: 18,
        required: true
    },
    userName: {
        type: String,
        length: 20,
        required: true
    },
    passWord: {
        type: String,
        length: 15,
        required: true
    },
    name: {
        type: String,
        length: 18,
        required: false
    },
    lastName: {
        type: String,
        length: 18,
        required: false
    },
});

module.exports = mongoose.model('users', usersModel);