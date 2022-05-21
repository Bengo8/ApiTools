require('dotenv').config();
const express = require('express');
const app = express();
const ApiInitializerService = require("./services/ApiInitializerService");

this.apiInitializer = new ApiInitializerService();

_initializeApi = () => {
    this.apiInitializer.setApiSettings();
    this.apiInitializer.connectToDBAndControlConnection();
    this.apiInitializer.setMiddlewares();
    this.apiInitializer.setRoutes();
}

_initializeApi();
