// authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { neonDB } = require('../middlewares/database');
const { resend } = require('../middlewares/database');

const minLength = 8;
const regex = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    digit: /\d/,
    special: /[!@#$%^&*(),.?":{}|<>]/
};

async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;
        if (password.length < minLength) {
            return res.json('Password must be at least ' + minLength + ' characters long');
        }
        if (!regex.lowercase.test(password)) {
            return res.json('Password must contain at least one lowercase letter');
        }
        if (!regex.uppercase.test(password)) {
            return res.json('Password must contain at least one uppercase letter');
        }
        if (!regex.digit.test(password)) {
            return res.json('Password must contain at least one digit');
        }
        if (!regex.special.test(password)) {
            return res.json('Password must contain at least one special character');
        }
        const existingUser = await neonDB`
        SELECT * FROM users
        WHERE email = ${email}
      `;

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await neonDB`
        INSERT INTO users (id, username, email, password,wrole)
        VALUES (uuid_generate_v4(), ${name}, ${email}, ${hashedPassword},'user')
        RETURNING id
      `;
        const data = await resend.emails.send({
            from: process.env.EMAIL,
            to: email,
            subject: 'Hello World',
            html: '<p>Thanks for registering</p>'
        });

        return res.status(201).json({ message: 'User registered successfully', userId: newUser[0].id });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function loginUser(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await neonDB`
    SELECT id, password ,wrole
    FROM users 
    WHERE email = ${email};`;
        if (user.length === 1) {
            const hashedPasswordFromDB = user[0].password;
            const passwordMatches = await bcrypt.compare(password, hashedPasswordFromDB);
            if (passwordMatches) {

                const userId = user[0].id;
                const secretKey = process.env.JWT_SECRET;

                const payload = {
                    user_id: userId,
                    role: user[0].wrole
                };

                const options = {
                    expiresIn: '1h'
                };
                const token = jwt.sign(payload, secretKey, options);
                res.status(200).json({ "message": "login successful", "token": token });
            }
            else {
                res.status(400).json({ "error": "Invalid username or password" });
            }
        }
        else {
            res.status(404).json({ "message": "No such user" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500)
    }
}


async function createSuperUser(req, res) {
    try {
        const { name, email, password } = req.body;
        if (password.length < minLength) {
            return res.json('Password must be at least ' + minLength + ' characters long');
        }
        if (!regex.lowercase.test(password)) {
            return res.json('Password must contain at least one lowercase letter');
        }
        if (!regex.uppercase.test(password)) {
            return res.json('Password must contain at least one uppercase letter');
        }
        if (!regex.digit.test(password)) {
            return res.json('Password must contain at least one digit');
        }
        if (!regex.special.test(password)) {
            return res.json('Password must contain at least one special character');
        }
        const existingUser = await neonDB`
      SELECT * FROM users
      WHERE email = ${email}
    `;

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await neonDB`
      INSERT INTO users (id, username, email, password,wrole)
      VALUES (uuid_generate_v4(), ${name}, ${email}, ${hashedPassword},'admin')
      RETURNING id
    `;
        const data = await resend.emails.send({
            from: process.env.EMAIL,
            to: email,
            subject: 'Hello World',
            html: '<p>Thanks for registering</p>'
        });
        return res.status(201).json({ message: 'User registered successfully', userId: newUser[0].id });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function  getAllUsers(req, res) {
    const p=req.params.id;
    console.log(p);
    const data=await neonDB`select * from users where email=${p}`;
    res.json(data);
}

module.exports = { registerUser, loginUser, createSuperUser,getAllUsers };
