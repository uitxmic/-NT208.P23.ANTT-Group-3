//middlewares/authMiddleware.js
const cookieParser = require('cookie-parser');
require('dotenv').config();
const express = require('express');
const app = express();
const parserCookie = cookieParser();
app.use(parserCookie);

const authMiddleware = (req, res, next) => {
    if (!req.session || !req.session.user) {
        console.error('No session or user found in session');
        return res.redirect('/users/login');
    }

    try {
        // Attach user information from session to the request object
        req.user = req.session.user;
        next();
    } catch (err) {
        console.error('Error in authMiddleware:', err);
        return res.status(403).json({ error: 'Unauthorized' });
    }
};

module.exports = authMiddleware;
