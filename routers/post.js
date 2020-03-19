const express = require('express');

const PostController = require('../controllers/post');
const md_auth = require('../middleware/authenticate');

// instanciamos express
const api = express.Router();

// routes
api.get('/get-posts', PostController.getPosts);
api.post('/add-post',[md_auth.ensureAuth], PostController.addPost);
api.put('/update-post/:id',[md_auth.ensureAuth], PostController.updatePost);
api.delete('/delete-post/:id',[md_auth.ensureAuth], PostController.deletePost);
api.get('/get-post/:url', PostController.getPost);

module.exports = api;