const jwt = require('jsonwebtoken');

// Middleware to authenticate the user
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract the token from 'Bearer token'

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to req.user
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateUser;
