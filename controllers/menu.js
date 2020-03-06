const Menu = require('../models/menu');

function addMenu(req, res) {
    const { title, url, order, active } = req.body;
    const menu = new Menu();

    menu.title = title;
    menu.url = url;
    menu.order = order;
    menu.active = active;

    menu.save((err, createdMenu) => {
        if (err) {
            res.status(500)
                .send({
                    ok: false,
                    message: 'Error del servidor'
                });
        } else {
            if (!createdMenu) {
                res.status(404)
                    .send({
                        ok: false,
                        message: 'No se ha podido guardar el menu'
                    });
            } else {
                res.status(200)
                    .send({
                        ok: true,
                        message: 'Menu guardado'
                    });
            }
        }
    });
}

function getMenus(req, res){

    Menu.find()
        .sort({order: 'asc'})
        .exec(
            (err, menuStored) => {
                if (err) {
                    res.status(500)
                        .send({
                            ok: false,
                            message: 'Error del servidor'
                        });
                } else {
                    if (!menuStored) {
                        res.status(404)
                            .send({
                                ok: false,
                                message: 'No se ha podido obtener menus almacenados'
                            });
                    } else {
                        res.status(200)
                            .send({
                                ok: true,
                                message: 'Lista de menus',
                                menu: menuStored
                            });
                    }
                }
            }
        );
}


module.exports = {
    addMenu,
    getMenus
}