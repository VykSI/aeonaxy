const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { cloudinary } = require('../middlewares/database');
const { neonDB } = require('../middlewares/database');
const { resend } = require('../middlewares/database');

async function createUser(req, res) {
    try {
        const userid = req.body.user;
        const description = req.body.description;
        const file = req.files.image;
        const result = await cloudinary.uploader.upload(file.tempFilePath);
        const newUser = await neonDB`
        INSERT INTO user_info (user_id, profile_pic_url, description)
        VALUES (${userid},${result.secure_url},  ${description})
        RETURNING user_id
      `;
        if (newUser) {
            res.status(200).json({ 'message': 'created' });
        }
        else {
            res.status(400).json('sorry');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
}
async function updateUser(req, res) {
    try {
        const userid = req.body.user;
        console.log(userid);
        const description = req.body.description;
        const file = req.files.image;
        let imageUrl = await neonDB`
    SELECT profile_pic_url FROM user_info WHERE user_id=${userid};`;
        console.log(imageUrl);
        imageUrl = imageUrl[0].profile_pic_url;
        const publicId = imageUrl.split('/').pop().split('.')[0];
        console.log(publicId);
        const data = cloudinary.uploader.destroy(publicId);

        const result = await cloudinary.uploader.upload(file.tempFilePath);
        const newUser = await neonDB`
    UPDATE user_info 
    SET profile_pic_url = ${result.secure_url}, 
        description = ${description} 
    WHERE user_id = ${userid};
      `;
        if (newUser) {
            res.status(200).json({ 'message': 'updated' });
        }
        else {
            res.status(400).json('sorry');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
}
async function getUserDetails(req, res) {

    try {
        const userId = req.body.user;

        const userDetails = await neonDB`
        SELECT users.username, users.email, user_info.description, user_info.profile_pic_url, courses.title AS course_title
        FROM users
        JOIN user_info ON users.id = user_info.user_id
        LEFT JOIN user_courses ON users.id = user_courses.user_id
        LEFT JOIN courses ON user_courses.course_id = courses.id
        WHERE users.id = ${userId}`;

        if (userDetails.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const courseTitles = userDetails.map(detail => detail.course_title).filter(title => title);

        res.status(200).json({
            name: userDetails[0].name,
            email: userDetails[0].email,
            description: userDetails[0].description,
            profile_pic_url: userDetails[0].profile_pic_url,
            course_titles: courseTitles
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }


}

module.exports = {
    createUser,
    updateUser,
    getUserDetails
};
