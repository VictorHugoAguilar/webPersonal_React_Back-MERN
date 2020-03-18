const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt.js');
const moment = require('moment');
const geoip = require('geoip-lite');
const fs = require('fs');
const path = require('path');

const User = require('../models/user');

function signUp(req, res) {
    const user = new User();
    const { email, password, repeatPassword, name, lastName } = req.body;

    user.email = email.toLowerCase();
    user.name = name;
    user.lastName = lastName;
    user.role = "admin";
    user.active = false;

    if (!password || !repeatPassword) {
        res.status(404).send({
            ok: false,
            message: 'Las contraseñas son obligatorias.'
        });
    } else {
        if (password !== repeatPassword) {
            res.status(404).send({
                ok: false,
                message: 'Las contraseñas tienen que coincidir.'
            });
        } else {
            bcrypt.hash(password, null, null, (err, hash) => {
                if (err) {
                    res.status(500).send({
                        ok: false,
                        message: err
                    });
                }
                // almacenamos el hash en el user.password
                user.password = hash;

                // grabamos en la base de datos
                user.save((err, userStore) => {
                    if (err) {
                        res.status(500).send({
                            ok: false,
                            message: 'Usuario ya registrado en la BD',
                            messageMongo: err
                        });
                    } else {
                        if (!userStore) {
                            res.status(404).send({
                                ok: false,
                                message: 'Error al crear el usuario'
                            });
                        } else {
                            res.status(200).send({
                                ok: true,
                                message: 'Usuario creado correctamente.',
                                user: userStore
                            });
                        }
                    }
                })
            });
        }
    }
}

function signIn(req, res) {
    const params = req.body;
    const email = params.email.toLowerCase();
    const password = params.password;

    User.findOne({ email: email }, (err, userStored) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: 'Error del servidor'
            });
        } else {
            if (!userStored) {
                res.status(404).send({
                    ok: false,
                    message: 'Usuario no registrado'
                });
            } else {
                bcrypt.compare(password, userStored.password, (err, check) => {
                    if (err) {
                        res.status(500).send({
                            ok: false,
                            message: 'Error del servidor'
                        });
                    } else if (!check) {
                        res.status(404).send({
                            ok: false,
                            message: 'La contraseña no es correcta'
                        });
                    } else {
                        if (!userStored.active) {
                            res.status(200).send({
                                ok: false,
                                message: 'El usuario no está activo'
                            });
                        } else {
                            res.status(200).send({
                                ok: true,
                                message: 'Usuario logeado',
                                accessToken: jwt.createAccessToken(userStored),
                                refreshToken: jwt.createRefreshToken(userStored),
                                accessDate: moment().format('LLLL'),
                                userName: userStored.name ? userStored.name : "anonymous",
                                userEmail: userStored.email,
                                UserIp: req.ip,
                                UserGeoIp: geoip.lookup('81.202.216.251')
                            });
                        }
                    }
                });
            }
        }
    })
}

function getUsers(req, res) {
    User.find()
        .then(users => {
            if (!users) {
                res.status(404)
                    .send({
                        ok: false,
                        message: 'No se han encontrado usuarios'
                    })
            } else {
                res.status(200)
                    .send({
                        ok: true,
                        message: 'Lista de usuarios enviada',
                        users: users
                    });
            }
        })
}

function getUsersActive(req, res) {
    const query = req.query;

    User.find({ active: query.active })
        .then(users => {
            if (!users) {
                res.status(404)
                    .send({
                        ok: false,
                        message: 'No se han encontrado usuarios'
                    })
            } else {
                res.status(200)
                    .send({
                        ok: true,
                        message: 'Lista de usuarios enviada',
                        users: users
                    });
            }
        })
}

function uploadAvatar(req, res) {
    const params = req.params;

    User.findById({ _id: params.id }, (err, userData) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: 'Error del servidor'
            });
        } else {
            if (!userData) {
                res.status(404).send({
                    ok: false,
                    message: 'No se ha encontrado usuario'
                });
            } else {
                let user = userData;
                if (req.files) {
                    let filePath = req.files.avatar.path;
                    let fileSplit = filePath.split('/');
                    let fileName = fileSplit[2];
                    let extSplit = fileName.split(".");
                    let ext = extSplit[1];

                    if (ext !== 'jpeg' && ext !== 'png' && ext !== 'jpg') {
                        res.status(400)
                            .send({
                                ok: false,
                                message: 'La extensión no es correcta'
                            });
                    } else {
                        user.avatar = fileName;
                        User.findByIdAndUpdate({ _id: params.id }, user, (err, userResult) => {
                            if (err) {
                                res.status(500).send({
                                    ok: false,
                                    message: 'Error del servidor'
                                })
                            } else {
                                if (!userResult) {
                                    res.status(404).send({
                                        ok: false,
                                        message: 'No se ha encontrado usuario'
                                    });
                                } else {
                                    res.status(200).send({
                                        ok: true,
                                        message: 'Usuario actualizado correctament',
                                        avatarName: fileName,
                                        user: userResult
                                    });
                                }
                            }
                        });
                    }
                }
            }
        }
    })
}


function getAvatar(req, res) {
    const avatarName = req.params.avatarName;
    const filePath = "./uploads/avatar/" + avatarName;

    fs.exists(filePath, exists => {
        if (!exists) {
            res.status(400)
                .send({
                    ok: false,
                    message: 'El avatar que buscas no existe'
                });
        } else {
            res.sendFile(path.resolve(filePath));
        }
    })
}

async function updateUser(req, res) {
    var userData = req.body;
    userData.email = req.body.email.toLowerCase();
    const params = req.params;

    if (userData.password) {
        await bcrypt.hash(userData.password, null, null, (err, hash) => {
            if (err) {
                res.status(500)
                    .send({
                        ok: false,
                        message: 'Error del servidor, al encriptar contraseña'
                    });
            } else {
                userData.password = hash;
            }
        });
    }

    User.findByIdAndUpdate({ _id: params.id }, userData, { new: true, safe: true }, (err, userUpdate) => {
        if (err) {
            res.status(500)
                .send({
                    ok: false,
                    message: 'Error del servidor'
                });
        } else {
            if (!userUpdate) {
                res.status(404)
                    .send({
                        ok: false,
                        message: 'No se ha encontrado usuario'
                    });
            } else {
                res.status(200)
                    .send({
                        ok: true,
                        message: 'Usuario actualizado correctamente',
                        user: userUpdate
                    })
            }
        }
    });
}

function activateUser(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    User.findByIdAndUpdate(id, { active }, { new: true, safe: true }, (err, userStore) => {
        if (err) {
            res.status(500)
                .send({
                    ok: false,
                    message: 'Error del servidor'
                });
        } else {
            if (!userStore) {
                res.status(404)
                    .send({
                        ok: false,
                        message: 'No se ha encontrado usuario'
                    });
            } else {
                let message = userStore.active ? 'Usuario activado correctamente' :
                    'Usuario desactivado correctamente';
                res.status(200)
                    .send({
                        ok: true,
                        message: message,
                        user: userStore
                    });
            }
        }
    });
}

function deleteUser(req, res) {
    const { id } = req.params;

    User.findByIdAndRemove(id, (err, userDeleted) => {
        if (err) {
            res.status(500)
                .send({
                    ok: false,
                    message: 'Error del servidor'
                });
        } else {
            if (!userDeleted) {
                res.status(404)
                    .send({
                        ok: false,
                        message: 'No se ha encontrado usuario'
                    });
            } else {
                res.status(200)
                    .send({
                        ok: true,
                        message: 'Usuario eliminado correctamente',
                        user: userDeleted
                    });
            }
        }
    })
}

async function createUser(req, res) {
    const user = new User();
    const { name, lastname, email, role, password } = req.body;

    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();
    user.role = role;
    user.active = true;

    if (!password || !email) {
        res.status(500)
            .send({
                ok: false,
                message: 'La contraseña y el email son obligatorios'
            });
    } else {
        await bcrypt.hash(user.password, null, null, (err, hash) => {
            if (err) {
                res.status(500)
                    .send({
                        ok: false,
                        message: 'La contraseña no se ha podido encriptar'
                    });
            } else {
                user.password = hash;
                // guardamos el nuevo usuario
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500)
                            .send({
                                ok: true,
                                message: 'Error en el servidor al guardar el nuevo usuario',
                            });
                    } else {
                        if (!userStored) {
                            res.status(404)
                                .send({
                                    ok: true,
                                    message: 'El usuario no se ha podido crear',
                                });
                        } else {
                            res.status(200)
                                .send({
                                    ok: true,
                                    message: 'Usuario creado correctamente',
                                    user: userStored
                                });
                        }
                    }
                })
            }
        });
    }
}

module.exports = {
    signUp,
    signIn,
    getUsers,
    getUsersActive,
    uploadAvatar,
    getAvatar,
    updateUser,
    activateUser,
    deleteUser,
    createUser
}