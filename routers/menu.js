const express = require('express');
const MenuController = require('../controllers/menu');

const multipart = require('connect-multiparty');

// Middleware
const mdAuth = require('../middleware/authenticate');
const mdUploadAvatar = multipart({ uploadDir: './uploads/avatar' })

const api = express.Router();


api.post('/add-menu', [mdAuth.ensureAuth], MenuController.addMenu);
api.get('/get-menus', MenuController.getMenus);
api.put('/update-menu/:id', [mdAuth.ensureAuth], MenuController.updateMenu);
api.put('/activate-menu/:id', [mdAuth.ensureAuth], MenuController.activateMenu);


module.exports = api;