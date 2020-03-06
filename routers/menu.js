const express = require('express');
const MenuController = require('../controllers/menu');

const multipart = require('connect-multiparty');

// Middleware
const mdAuth = require('../middleware/authenticate');
const mdUploadAvatar = multipart({ uploadDir: './uploads/avatar' })

const api = express.Router();


api.post('/add-menu', [mdAuth.ensureAuth], MenuController.addMenu);
api.get('/get-menus', MenuController.getMenus);

module.exports = api;