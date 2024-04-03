require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 9876;
const testServerUrl = process.env.TEST_SERVER_URL;

app.use(express.json());

const registrationDetails = {
    "companyName": "HeavyCalculator",
    "clientID": "f94eab4f-cf57-4423-814b-cbfdad181bbb",
    "clientSecret": "HRNvtLlNkMkkaUZa",
    "ownerName": "Arpit Sagar",
    "ownerEmail": "am7136@srmist.edu.in",
    "rollNo": "RA2111028010180"
};

const credentials = {
    clientID: "f94eab4f-cf57-4423-814b-cbfdad181bbb",
    clientSecret: "HRNvtLlNkMkkaUZa"
};