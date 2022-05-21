const mongoose = require("mongoose");

const authModel = new mongoose.Schema({
    serverIP: {
        type: String,
        length: 20,
        required: true
    },
    globalSecretKey: {
        type: String,
        length: 20,
        required: true
    },
    origin: {
        type: String,
        length: 200,
        required: true
    }
}, { collection: 'authdata' });

const authDB = mongoose.connection.useDb('authGlobalDB');
module.exports = authDB.model('authdata', authModel);