const mongoose = require("mongoose");

const authUsersModel = new mongoose.Schema({
    ipOrigin: {
        type: String,
        length: 20,
        required: true
    },
    secretKey: {
        type: String,
        length: 30,
        required: true
    }
}, { collection: 'authUsers' });

const authDB = mongoose.connection.useDb('authGlobalDB');
module.exports = authDB.model('authUsers', authUsersModel);