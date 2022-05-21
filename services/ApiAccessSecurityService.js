const jwt = require('jsonwebtoken');
const authData = require("../models/authorizationDataModel");
const authUsers = require("../models/authUsersModel");

class ApiAccessSecurityService {
    constructor() {
        this._getAuthData();
        this.accesTokenKey = process.env.ACCESS_TOKEN_SECRET;
        this.debugMode = process.env.debugMode;
    }

    securityControls = async (req, res, next) => {
        if (this.debugMode) {
            this._setBodyRequestData(req);
        }
        
        const respStatus = await this._checkControls(req);

        if (!this._isResponseStatusOK([respStatus])) {
            return res.sendStatus(respStatus);
        }

        next();
    }

    _getAuthData = () => {
        authData.find({id: '61da0cc7405aaf3fc4198a28'}, (err, data) => {
            if (err || !this._checkNullsAndUndefineds(data[0])) {
                console.error(err);
            } else {
                this.serverIP = data[0].serverIP;
                this.globalSecretKey = data[0].globalSecretKey ;
                this.origin = data[0].origin;
            }
        });
    }

    _setBodyRequestData = (req) => {
        req.body.origin = "http://localhost:3000/";
        req.body.ipserver = "192.168.0.21";
        req.body.secretKey = "$2GGLIi%$x2v$K5FlXrI";
        req.body.iporigin = "192.168.0.21";
    }

    _checkControls = async (req) => {
        let respStatus = [];
        respStatus.push(await this._checkAuthToken(req));
        respStatus.push(this._checkServerIP(req));
        respStatus.push(this._checkGlobalSecretKey(req));

        if (!this._isResponseStatusOK(respStatus)) {
            console.log("controles de seguridad no pasados", respStatus);
            return this._getResponseStatusError(respStatus);
        }

        return 0;
    }

    _checkAuthToken = async (req) => {
        const encodedToken = this._getAuthEncodedToken(req);
        const tokenCheckedResponse = await this._decodeAndCheckAuthToken(req, encodedToken);

        return tokenCheckedResponse;
    }

    _getAuthEncodedToken = (req) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        return token;
    }

    _decodeAndCheckAuthToken = async (req, encodedToken) => {
        let respStatus = 401;
        if (!this._checkNullsAndUndefineds(encodedToken)) return respStatus;
        
        const decodedToken = await this._decodeToken(encodedToken);
        if (this._checkNullsAndUndefineds(decodedToken)) {
            respStatus = await this._checkDecodedToken(req, decodedToken);
        } else {
            respStatus = 403
        }        

        return respStatus;
    }

    _decodeToken = async (token) => {
        let decodedToken;
        try {
            decodedToken = await jwt.verify(token, this.accesTokenKey);
        } catch (error) {
            console.error("error jwt verify token", error);
            decodedToken = null;
        }

        return decodedToken;
    }

    _checkDecodedToken = async (req, token) => {
        let responseStatus = [];
        const tokenOrigin = token.origin;
        const tokenIPOrigin = token.ipOrigin;
        const tokenSecretKey = token.secretKey;

        try {
            responseStatus.push(await this._checkOrigin(req, tokenOrigin));
            responseStatus.push(await this._checkIPAndUniqueSecretKey(req, tokenIPOrigin, tokenSecretKey));
        } catch (error) {
            console.error("error jwt check token", error);
            return 403;
        }

        return this._isResponseStatusOK(responseStatus) ? 0 : 403;
    }

    _checkOrigin = (req, origin) => {
        if (!this._checkNullsAndUndefineds(origin) || origin !== this.origin || origin !== req.body.origin) {
            return 403;
        }

        return 0;
    }

    _checkIPAndUniqueSecretKey = async (req, ipOrigin, secretKey) => {
        if (!this._checkOriginIP(req, ipOrigin)) {
            return 403;
        }

        if (!await this._checkAndGetSecretKey(secretKey, ipOrigin)) {
            return 403;
        }

        return 0;
    }

    _checkOriginIP = (req, ipOrigin) => {
       return this._checkNullsAndUndefineds(ipOrigin) && ipOrigin === req.body.iporigin;
    }

    _checkAndGetSecretKey = async (secretKey, ipOrigin) => {
        const bdScretKey = await this._getSecretKey(ipOrigin);
        return this._checkNullsAndUndefineds(secretKey) && secretKey === bdScretKey;
     }

     _getSecretKey = async (IPAddOrigin) => {
        const secretKey = await authUsers.findOne({ipOrigin: IPAddOrigin});
        if (this._checkNullsAndUndefineds(secretKey)) {
            return secretKey.secretKey;
        }
        return null;
     }

    _checkServerIP = (req) => {
        const serverIP = req.body.ipserver;

        if (!this._checkNullsAndUndefineds(serverIP)) {
            return 401;
        }

        if (serverIP !== this.serverIP) {
            return 403;
        }

        return 0;
    }

    _checkGlobalSecretKey = (req) => {
        const secretKey = req.body.secretKey;

        if (!this._checkNullsAndUndefineds(secretKey)) {
            return 401;
        }

        if (secretKey !== this.globalSecretKey) {
            return 403;
        }

        return 0;
    }

    _isResponseStatusOK = (status) => {
        return status.find(oneStatus => oneStatus !== 0) === undefined;
    }

    _getResponseStatusError = (status) => {
        const errorStatusIndex = status.findIndex(oneStatus => oneStatus !== 0);
        return (errorStatusIndex >= 0 && (status[errorStatusIndex] == 403 || status[errorStatusIndex] == 401)) ? status[errorStatusIndex] : 403;
    }

    _checkNullsAndUndefineds = (value) => {
        return value !== undefined && value !== null;
    }
}

module.exports = ApiAccessSecurityService;