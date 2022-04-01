// Handle requests for Twilio TURN server credentials
const express = require("express");
const twilio = require("twilio");
const turnController = express.Router();
const config = require("../config");

const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;

turnController.get("/", 
  async (req, res) => {
    //console.log(accountSid, authToken)
    const client = twilio(accountSid, authToken);
    client.tokens.create().then(token => {
        res.send(token.iceServers);
    });
});

module.exports = turnController;
