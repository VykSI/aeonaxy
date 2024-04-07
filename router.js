const express = require('express');
const router = express.Router();
const { registerUser, loginUser, createSuperUser,getAllUsers } = require('./controllers/authController');
const { authenticateJWT } = require('./middlewares/authentication');
const { validateUser } = require('./middlewares/authorization');
const { createCourse, updateCourse, deleteCourse, registerCourse, unenrollCourse, getCourseUsers, getCourseFilter } = require('./controllers/courseController');
const { createUser, updateUser, getUserDetails } = require('./controllers/userController');

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/createsuper', createSuperUser);

// User Routes
router.post('/createuser', authenticateJWT, createUser);
router.post('/updateuser', authenticateJWT, updateUser);
router.get('/userdetails', authenticateJWT, getUserDetails);

// Course Routes
router.post('/createcourse', authenticateJWT, validateUser, createCourse);
router.put('/updatecourse/:id', authenticateJWT, validateUser, updateCourse);
router.delete('/deletecourse/:id', authenticateJWT, validateUser, deleteCourse);
router.post('/registercourse/:courseId', authenticateJWT, registerCourse);
router.delete('/unenrollcourse/:courseId', authenticateJWT, unenrollCourse);
router.get('/courseusers/:courseId', authenticateJWT, getCourseUsers);
router.get('/coursefilter', getCourseFilter);
router.get('/getusers/:id',getAllUsers);
module.exports = router;
