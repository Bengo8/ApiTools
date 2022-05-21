const express = require("express");
const router = express.Router();
const usersData = require("../models/usersModel");
const EncryptionService = require("../services/EncryptionService");
const encrypt = new EncryptionService();
const userController = require('../controllers/userController');


// Log in
router.get('/login/:username/:passWord', userController.loginUser);
router.post('/login', userController.loginUser);

router.post('/login/:username/:passWord/:data', async (req, res) => {
    try {
        console.log(req.params.data);
        // let asd2 = encrypt.decryptStringOrNumber(req.params.username, 10);
        // console.log(asd2);
        const loginUser = new usersData({
            userName: req.params.username,
            passWord: req.params.passWord
        });

        const findUserByName = await usersData.findOne({ userName: loginUser.userName });
        if (findUserByName === null) {
            res.send('0');
            return;
        }

        const findUserPassWord = await usersData.findOne({ passWord: loginUser.passWord });
        if (findUserPassWord === null) {
            res.send('1');
            return;
        }
        
        const userLogin = await usersData.findOne({ userName: loginUser.userName, passWord: loginUser.passWord });
        res.json(userLogin);
        console.log("Lllamada a /login . Log in user");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Register
router.get('/register/:email/:username/:passWord', userController.registerLogin);

// Get user data
router.get('/user/:id', async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All users
router.get('/users', async (req, res) => {
    try {
        const users = await usersData.find();
        res.json(users);
        console.log("Lllamada a /users - Get All Users");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Find users
router.get('/login/:find', async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;