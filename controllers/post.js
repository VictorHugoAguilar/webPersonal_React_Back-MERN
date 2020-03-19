const Post = require('../models/post');
const moment = require('moment');


function getPosts(req, res) {
    const { page , limit = 10 } = req.query;

    const options = {
        page: page,
        limit: parseInt(limit),
        sort: { date: 'desc' }
    };

    Post.paginate({}, options, (err, postsStored) => {
        if (err) {
            res.status(500).send({ ok: false, code: 500, message: 'Error en el servidor' });
        } else {
            if (!postsStored) {
                res.status(404).send({ ok: false, code: 404, message: 'No se ha encontrado ningún post' });
            } else {
                res.status(200).send({ ok: true, code: 200, message: 'Post recuperados correctamente', posts: postsStored });
            }
        }
    });

}

function addPost(req, res) {
    const body = req.body;
    const post = new Post(body);

    post.save((err, postStored) => {
        if (err) {
            res.status(500).send({ ok: false, code: 500, message: 'Error en el servidor' });
        } else {
            if (!postStored) {
                res.status(404).send({ ok: false, code: 404, message: 'No se ha podido crear el post' });
            } else {
                res.status(200).send({ ok: true, code: 200, message: 'Post creado correctamente', post: postStored });
            }
        }
    });
}

function updatePost(req, res) {
    const postData = req.body;
    const { id } = req.params;

    Post.findByIdAndUpdate(id, postData, { new: true, safe: true }, (err, postUpdate) => {
        if (err) {
            res.status(500).send({ ok: false, code: 500, message: 'Error en el servidor' });
        } else {
            if (!postUpdate) {
                res.status(404).send({ ok: false, code: 404, message: 'No se ha podido actualizar el post' });
            } else {
                res.status(200).send({ ok: true, code: 200, message: 'Post actualizado correctamente', post: postUpdate });
            }
        }
    });
}

function deletePost(req, res) {
    const { id } = req.params;

    Post.findByIdAndRemove(id, { safe: true }, (err, postDeleted) => {
        if (err) {
            res.status(500).send({ ok: false, code: 500, message: 'Error en el servidor' });
        } else {
            if (!postDeleted) {
                res.status(404).send({ ok: false, code: 404, message: 'No se ha podido eliminar el post' });
            } else {
                res.status(200).send({ ok: true, code: 200, message: 'Post eliminado correctamente', post: postDeleted });
            }
        }
    });
}

function getPost(req, res) {
    const { url } = req.params;

    Post.findOne({ url }, (err, postStored) => {
        if (err) {
            res.status(500).send({ ok: false, code: 500, message: 'Error en el servidor' });
        } else {
            if (!postStored) {
                res.status(404).send({ ok: false, code: 404, message: 'No se ha podido encontrar el post' });
            } else {
                res.status(200).send({ ok: true, code: 200, message: 'Post encontrado correctamente', post: postStored });
            }
        }
    });
}


module.exports = {
    getPosts,
    addPost,
    updatePost,
    deletePost,
    getPost
}