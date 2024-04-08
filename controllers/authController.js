// authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { neonDB } = require('../middlewares/database');
const { resend, transporter } = require('../middlewares/database');

const minLength = 8;
const regex = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    digit: /\d/,
    special: /[!@#$%^&*(),.?":{}|<>]/
};

const crypto = require('crypto');

function generateOTP() {
    // Generate a secure random number between 100000 and 999999
    const otp = crypto.randomInt(100000, 999999);
    return otp.toString(); // Convert to string
}




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
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Thanks for registeration',
            text: 'Welcome to our website.'

        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error occurred while sending email:', error);
            } else {
                console.log('Email sent successfully:', info.response);
            }
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
        res.status(500).json("Server Error");
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

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Thanks for registeration',
            text: 'Welcome to our website.'

        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error occurred while sending email:', error);
            } else {
                console.log('Email sent successfully:', info.response);
            }
        });
        return res.status(201).json({ message: 'User registered successfully', userId: newUser[0].id });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}



async function resetpassword(req, res) {
    const email = req.body.email;
    const otp = generateOTP();
    const payload = {
        user_id: email,
        otp: otp
    };

    const options = {
        expiresIn: '1h'
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    const websiteUrl = `${req.protocol}://${req.get('host')}`;
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'RESET password',
        text: `Click on this link to reset password
        ${websiteUrl}/api/reset/${token} with otp ${otp}`

    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json("Server error");
        } else {
            return res.status(200).json("Email Sent");
        }
    });
}

async function reset(req, res) {
    const token = req.params.id;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    await jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.body.email = decodedToken.user_id;
        req.body.otp1 = decodedToken.otp;
    });
    const password = req.body.password;
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
    const hashedPassword = await bcrypt.hash(password, 10);
    if (parseInt(req.body.otp1) == parseInt(req.body.otp)) {
        const data = await neonDB`UPDATE users 
        SET password = ${hashedPassword} 
        WHERE email = ${req.body.email}`;
        res.status(200).json("success");
    }
    else {
        return res.status(401).json({ message: "invalid otp" });
    }
}

module.exports = { registerUser, loginUser, createSuperUser,  resetpassword, reset };
