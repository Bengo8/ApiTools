const UserModel = require('../models/usersModel');

exports.loginUser = async (req, res) => {
    try {
        const loginUser = new UserModel({
            userName: req.params.username,
            passWord: req.params.passWord
        });

        const findUserByName = await UserModel.findOne({ userName: loginUser.userName });
        if (findUserByName === null) {
            res.send('0');
            return;
        }

        const findUserPassWord = await UserModel.findOne({ passWord: loginUser.passWord });
        if (findUserPassWord === null) {
            res.send('1');
            return;
        }

        const userLogin = await UserModel.findOne({ userName: loginUser.userName, passWord: loginUser.passWord });
        res.json(userLogin);
        console.log("Lllamada a /login . Log in user");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.registerLogin = async (req, res) => {
    const registerUser = new UserModel({
        userName: req.params.username,
        passWord: req.params.passWord,
        email: req.params.email
    });

    try {
        const findUserByEmail = await UserModel.findOne({ email: registerUser.email });
        if (findUserByEmail !== null) {
            res.send('1');
            return;
        }

        const findUserByName = await UserModel.findOne({ userName: registerUser.userName });
        if (findUserByName !== null) {
            res.send('0');
            return;
        }

        const newUser = await registerUser.save();
        res.status(201).json(newUser);

        console.log("Lllamada a /register . Registro de usuario", registerUser.userName);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}