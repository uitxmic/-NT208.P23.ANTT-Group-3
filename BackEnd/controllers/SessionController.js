const express = require('express');

class SessionController {
    // [GET] /session
    getSession = (req, res) => {
        if (req.session && req.session.user && req.session.user.UserId) {
            res.status(200).json({ UserId: req.session.user.UserId });
        } else {
            console.error('No active session found');
            res.status(401).json({ message: 'No active session' });
        }
    };

    // [DELETE] /session
    destroySession = (req, res) => {
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return res.status(500).json({ message: 'Failed to destroy session' });
                }
                res.clearCookie('session_id');
                res.json({ message: 'Session destroyed successfully' });
            });
        } else {
            res.status(400).json({ message: 'No session to destroy' });
        }
    };

    // [GET] /session/userRoleId
    getUserRoleId = (req, res) => {
        if (req.session && req.session.user && req.session.user.UserRoleId) {
            res.json({ UserRoleId: req.session.user.UserRoleId });
        } else {
            res.status(401).json({ message: 'No active session or UserRoleId not found' });
        }
    };
}

module.exports = new SessionController();