// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const secretKey = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Authorization error:', err);
        return res.status(403).json({ error: 'Unauthorized' });
    }
};

module.exports = authMiddleware;
