//CourseSchema
const Course = require('../models/course');

function addCourse(req, res) {
    const body = req.body;
    const course = new Course(body);
    course.order = 1000;

    course.save((err, courseStored) => {
        if (err) {
            res
                .status(500)
                .send({
                    ok: false,
                    code: 500,
                    message: 'El curso ya existe'
                })
        } else {
            if (!courseStored) {
                res
                    .status(404)
                    .send({
                        ok: false,
                        code: 404,
                        message: 'No se ha podido registrar'
                    })
            } else {
                res
                    .status(200)
                    .send({
                        ok: true,
                        code: 200,
                        message: 'Curso registrado correctametes',
                        course: courseStored
                    })
            }
        }
    });
}

function getCourses(req, res) {
    Course.find()
        .sort({ order: 'asc' })
        .exec((err, coursesStored) => {
            if (err) {
                res.status(500)
                    .send({
                        ok: false,
                        code: 500,
                        message: 'Error en el servidor'
                    })
            } else {
                if (!coursesStored) {
                    res.status(404)
                        .send({
                            ok: false,
                            code: 404,
                            message: 'No se han encontrado datos'
                        })
                } else {
                    res.status(200)
                        .send({
                            ok: true,
                            code: 200,
                            message: 'Listado de cursos',
                            courses: coursesStored
                        })
                }
            }
        });
}

function deleteCourse(req, res) {
    const { id } = req.params;

    Course.findByIdAndRemove(id, { new: true, safe: true }, (err, courseDeleted) => {
        if (err) {
            res.status(500)
                .send({
                    ok: false,
                    code: 500,
                    message: 'Error en el servidor'
                })
        } else {
            if (!courseDeleted) {
                res.status(404)
                    .send({
                        ok: false,
                        code: 404,
                        message: 'No se han podido eliminar'
                    })
            } else {
                res.status(200)
                    .send({
                        ok: true,
                        code: 200,
                        message: 'Curso eliminado',
                        course: courseDeleted
                    })
            }
        }
    });

}

function updateCourse(req, res){
    const courseData = req.body;
    const id = req.params.id;

    Course.findByIdAndUpdate(id, courseData, { new: true, safe: true}, (err, courseUpdate) => {
        if (err) {
            res.status(500)
                .send({
                    ok: false,
                    code: 500,
                    message: 'Error en el servidor'
                })
        } else {
            if (!courseUpdate) {
                res.status(404)
                    .send({
                        ok: false,
                        code: 404,
                        message: 'No se han podido actualizar el curso'
                    })
            } else {
                res.status(200)
                    .send({
                        ok: true,
                        code: 200,
                        message: 'Curso actualizado',
                        course: courseUpdate
                    })
            }
        }
    })



}

module.exports = {
    addCourse,
    getCourses, 
    deleteCourse,
    updateCourse
}
