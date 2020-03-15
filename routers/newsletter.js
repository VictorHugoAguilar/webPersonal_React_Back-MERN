const express = require('express');
const NewsletterController = require('../controllers/newsletter');

const api = express.Router();

api.post('/suscribe-newsletter/:mail', NewsletterController.suscribeMail );

module.exports = api;