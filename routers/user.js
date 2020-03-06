const express = require('express');
const UserController = require('../controllers/user');
const multipart = require('connect-multiparty');

// Middleware
const mdAuth = require('../middleware/authenticate');
const mdUploadAvatar = multipart({ uploadDir: './uploads/avatar' })

const api = express.Router();

api.post('/sign-up', UserController.signUp);
api.post('/sign-in', UserController.signIn);
api.get('/users', [mdAuth.ensureAuth], UserController.getUsers);
api.get('/users-active', [mdAuth.ensureAuth], UserController.getUsersActive);
api.put('/upload-avatar/:id', [mdAuth.ensureAuth, mdUploadAvatar], UserController.uploadAvatar);
api.get('/get-avatar/:avatarName', UserController.getAvatar);
api.put('/update-user/:id', [mdAuth.ensureAuth], UserController.updateUser);
api.put('/activate-user/:id', [mdAuth.ensureAuth], UserController.activateUser);
api.delete('/delete-user/:id', [mdAuth.ensureAuth], UserController.deleteUser);
api.post('/sign-up-admin', [mdAuth.ensureAuth], UserController.createUser);

module.exports = api;