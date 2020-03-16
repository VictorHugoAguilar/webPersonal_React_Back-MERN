const express = require('express');
const CourseController = require('../controllers/course');
const md_auth = require('../middleware/authenticate');

const api = express.Router();

// routes
api.post('/add-course', [md_auth.ensureAuth], CourseController.addCourse);
api.get('/get-courses', CourseController.getCourses);
api.delete('/delete-course/:id', [md_auth.ensureAuth], CourseController.deleteCourse);
api.put('/update-course/:id', [md_auth.ensureAuth], CourseController.updateCourse);

module.exports = api;