const jwt = require('jwt-simple');
const moment = require('moment');

// esta es la misma que tenemos en el services
const SECRET_KEY = 'claveSecretaApi';

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403)
            .send({
                ok: false,
                message: 'La petición no tiene cabecera de autentificación'
            });
    }

    const token = req.headers.authorization.replace(/['"]+/g, "");
    var payload = null;

    try {
        payload = jwt.decode(token, SECRET_KEY);

        if (payload.exp <= moment().unix()) {
            return res.status(404).send({
                ok: false,
                message: 'El token ha expirado'
            });
        }
    } catch (error) {
        return res.status(404).send({
            ok: false,
            message: 'Token invalido',
            messageServer: error
        });
    }

    req.user = payload;
    next();
}