const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; 

function authenticateJWT(req, res, next) {
    
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.body.user = decodedToken.user_id;
        req.body.role = decodedToken.role;
        next(); 
    });
}

module.exports = { authenticateJWT };
