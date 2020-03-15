const Newsletter = require('../models/newsletter');

function suscribeMail(req, res) {
    const email = req.params.mail;
    const newsletter = new Newsletter();
    if (!email) {
        res
            .status(404)
            .send({
                ok: false,
                code: 404,
                message: 'El mail es obligatorio'
            })
    } else {
        newsletter.email = email.toLowerCase();
        newsletter.save((err, newsletterStored) => {
            if (err) {
                res
                    .status(500)
                    .send({
                        ok: false,
                        code: 500,
                        message: 'Error en el servidor'
                    })
            } else {
                if (!newsletterStored) {
                    res
                        .status(404)
                        .send({
                            ok: false,
                            code: 404,
                            message: 'No se ha podido registrar, email repetido'
                        })
                } else {
                    res
                        .status(200)
                        .send({
                            ok: true,
                            code: 200,
                            message: 'Email registrado correctametes'
                        })
                }
            }
        });
    }


}

module.exports = {
    suscribeMail
}