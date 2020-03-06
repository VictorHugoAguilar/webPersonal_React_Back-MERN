const app = require('./app');
const mongoose = require('mongoose');
const port = process.env.PORT || 3977;
const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");

// configuramos moongoose
mongoose.set('useFindAndModify', false);
// Connect with mongoDB
mongoose.connect(`mongodb://${IP_SERVER}:${PORT_DB}/webPersonal`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) {
            throw err;
        } else {
            console.log('La conexión a la base de datos es correcta');
            app.listen(port, () => {
                console.log("***********************************************************");
                console.log("***                    __                               ***");
                console.log("***                  .'  '.                             ***");
                console.log("***              _.-'/  |  )                            ***");
                console.log("***   ,       _.-   (     0  -                          ***");
                console.log("***   ()   .-        -- -.__. =====================     ***");
                console.log("***   ( )-        .___.--._)=========================|  ***");
                console.log("***   )           .'      |                          |  ***");
                console.log("***    |   /,_.-'         |     Conexion a la BD     |  ***");
                console.log("***  _/   _.'(            |         Correcta         |  ***");
                console.log("***  /  ,-' ) )           |                          |  ***");
                console.log("***  )  )    `-'          |                          |  ***");
                console.log("***  `-'                  '--------------------------'  ***");
                console.log("***********************************************************");
                console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}/`)
            })
        }
    });


