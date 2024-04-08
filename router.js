const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { registerUser, loginUser, createSuperUser,resetpassword,reset } = require('./controllers/authController');
const { authenticateJWT } = require('./middlewares/authentication');
const { validateUser } = require('./middlewares/authorization');
const { createCourse, updateCourse, deleteCourse, registerCourse, unenrollCourse, getCourseUsers, getCourseFilter } = require('./controllers/courseController');
const { createUser, updateUser, getUserDetails } = require('./controllers/userController');

const logFilePath = path.join(__dirname, 'access.log');

// Logging middleware
router.use((req, res, next) => {
    const startTime = new Date();
    res.on('finish', () => {
        const endTime = new Date();
        const logMessage = `[${endTime.toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${endTime - startTime} ms)\n`;
        fs.appendFile(logFilePath, logMessage, (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
            }
        });
    });
    next();
});
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
router.post('/resetpassword',resetpassword);
router.post('/reset/:id',reset);
module.exports = router;
