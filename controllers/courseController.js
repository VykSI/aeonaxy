const { neonDB } = require('../middlewares/database');

async function createCourse(req, res) {
    try {
        const { title, description, category, difficulty, rating } = req.body;
        const data = await neonDB`
  INSERT INTO courses (title, description, category, difficulty, rating) 
VALUES (${title},${description},${category},${difficulty},${rating}) RETURNING id`;
        res.status(201).json(data[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}
async function updateCourse(req, res) {
    try {
        const courseId = req.params.id;
        const { title, description, category, difficulty, rating } = req.body;

        const data = await neonDB`
      UPDATE courses 
      SET 
        title = ${title}, 
        description = ${description}, 
        category = ${category}, 
        difficulty = ${difficulty}, 
        rating = ${rating}
      WHERE id = ${courseId}
      RETURNING id`;

        if (data.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json(data[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function deleteCourse(req, res) {
    try {
        const courseId = req.params.id;

        const data = await neonDB`
      DELETE FROM courses 
      WHERE id = ${courseId}
      RETURNING id`;

        if (data.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function registerCourse(req, res) {
    try {
        const userId = req.body.user;
        const courseId = req.params.courseId;

        const existingRegistration = await neonDB`
      SELECT * FROM user_courses 
      WHERE user_id = ${userId} AND course_id = ${courseId}`;

        if (existingRegistration.length > 0) {
            return res.status(400).json({ message: "User is already registered for this course" });
        }

        const registrationData = await neonDB`
      INSERT INTO user_courses (user_id, course_id) 
      VALUES (${userId}, ${courseId}) 
      RETURNING *`;
        const data = await resend.emails.send({
            from: process.env.EMAIL,
            to: email,
            subject: 'Hello World',
            html: '<p>Thanks for registering to this course</p>'
        });
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'enrolled',
            text: '<p>You have enerolled for the course</p>'
            
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error occurred while sending email:', error);
            } else {
                console.log('Email sent successfully:', info.response);
            }
        });
        
        res.status(201).json(registrationData[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function unenrollCourse(req, res) {
    try {
        const userId = req.body.user;
        const courseId = req.params.courseId;

        const existingRegistration = await neonDB`
      SELECT * FROM user_courses 
      WHERE user_id = ${userId} AND course_id = ${courseId}`;

        if (existingRegistration.length === 0) {
            return res.status(404).json({ message: "User is not registered for this course" });
        }

        await neonDB`
      DELETE FROM user_courses 
      WHERE user_id = ${userId} AND course_id = ${courseId}`;
        const data = await resend.emails.send({
            from: process.env.EMAIL,
            to: email,
            subject: 'Hello World',
            html: '<p>You have unenerolled from this course</p>'
        });
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Unenrolled',
            text: '<p>You have unenerolled from this course</p>'
            
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error occurred while sending email:', error);
            } else {
                console.log('Email sent successfully:', info.response);
            }
        });
        res.status(200).json({ message: "User successfully unenrolled from the course" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getCourseUsers(req, res) {
    try {
        const courseId = req.params.courseId;
        const page = parseInt(req.query.page) || 1;
        const limit = 1;

        const offset = (page - 1) * limit;

        const usersInCourse = await neonDB`
            SELECT users.username
            FROM users
            JOIN user_courses ON users.id = user_courses.user_id
            WHERE user_courses.course_id = ${courseId}
            LIMIT ${limit} OFFSET ${offset}`;

        res.status(200).json(usersInCourse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


async function getCourseFilter(req, res) {
    try {
        const rating = req.query.rating || null;
        const difficulty = req.query.difficulty || null;
        const page = parseInt(req.query.page) || 1;
        const limit = 1;
        let data;

        if (rating === null && difficulty === null) {
            const offset = (page - 1) * limit;
            data = await neonDB`
                SELECT *
                FROM courses
                WHERE difficulty = ANY (ARRAY['beginner', 'intermediate', 'advanced']::difficulty_level[])
                  AND rating = ANY (ARRAY['0', '1', '2', '3', '4', '5']::rating_value[])
                LIMIT ${limit} OFFSET ${offset}`;
        } else if (rating !== null && difficulty !== null) {
            data = await neonDB`
                SELECT * 
                FROM courses
                WHERE difficulty = ${difficulty}
                  AND rating = ${rating}`;
        } else if (difficulty !== null) {
            data = await neonDB`
                SELECT * 
                FROM courses
                WHERE difficulty = ${difficulty}`;
        } else if (rating !== null) {
            data = await neonDB`
                SELECT *
                FROM courses
                WHERE rating = ${rating}`;
        }
        res.status(200).json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json("server error");
    }
}


module.exports = {
    createCourse,
    updateCourse,
    deleteCourse,
    registerCourse,
    unenrollCourse,
    getCourseUsers,
    getCourseFilter
};
