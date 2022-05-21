
const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('../routes/users');
const ApiAccessSecurityService = require("./ApiAccessSecurityService");

class ApiInitializerServie {
    constructor() {
        this.app = express();
        this.database = undefined;
        this.port = process.env.PORT || 3001;
        this.apiAccesSecurity = new ApiAccessSecurityService();
    }

    setApiSettings = () => {
        this._setContentType();
        this._setHeaders();
    }

    connectToDBAndControlConnection = () => {
        this._connectToDB();
        this._controlConnection();
    }

    setRoutes = () => {
        this._setRoutes();
    }

    setMiddlewares = () => {
        this._setSecurityControls();
    }

    _setContentType = () => {
        this.app.use(express.json());
    }

    _setHeaders = () => {
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', "*");
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, X-Api-IP, X-Api-SecretKey, X-Api-Token, Authorization');
            res.header('Request-Date', Date.now());
            next();
        });
    }

    _connectToDB = () => {
        mongoose.connect(process.env.DATABASE_URL);
        this.database = mongoose.connection;
    }

    _controlConnection = () => {
        this.database.on('error', (error) => console.error("ERROR conecting to DataBase: ", error));
        this.database.once('open', () => {
            console.log("Connected to Database");
            this.app.listen(this.port, () => {
                console.log("Server Started at port ", this.port)
            });
        });
    }

    _setSecurityControls = () => {
        this.app.use(this.apiAccesSecurity.securityControls);
    }

    _setRoutes = () => {
        this.app.use(usersRoutes);
    }
}

module.exports = ApiInitializerServie;