//middlewares/authMiddleware.js
const cookieParser = require('cookie-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const express = require('express');
const app = express();
const parserCookie = cookieParser();
app.use(parserCookie);

const authMiddleware = (req, res, next) => {
    try{
        const data = fs.readFileSync('sessions.json', 'utf8');
        sessions = JSON.parse(data);
    } catch (err) {
        console.error('Read file error:', err);
        return res.status(500).json({ error: 'Read file error', details: err.message });
    }
    const session_id = req.cookies.session_id;
    console.log('sessions:', sessions);
    token = sessions[session_id];
    console.log('au token:', token);

    if (!token) {
        return res.redirect('users/login');
    }

    try {
        const secretKey = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        res.redirect('users/login');
        return res.status(403).json({ error: 'Unauthorized' });
    }
};

module.exports = authMiddleware;
