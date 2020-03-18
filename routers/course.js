const express = require('express');
const CourseController = require('../controllers/course');
const md_auth = require('../middleware/authenticate');

const api = express.Router();

// routes
api.get('/get-courses', CourseController.getCourses);
api.post('/add-course', [md_auth.ensureAuth], CourseController.addCourse);
api.put('/update-course/:id', [md_auth.ensureAuth], CourseController.updateCourse);
api.delete('/delete-course/:id', [md_auth.ensureAuth], CourseController.deleteCourse);

module.exports = api;