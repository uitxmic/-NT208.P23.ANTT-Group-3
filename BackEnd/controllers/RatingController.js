const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class RatingController {
    constructor() {
        this.initConnection();
    }

    async initConnection() {
        try {
            this.connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });

            console.log('Connected to the database (async)');
        } catch (err) {
            console.error('Database connection error:', err);
        }
    }

    // [Post] /rating/addRating
    AddRating = async (req, res) => {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        try {
            const { PostId, Vote, Rating, TransactionId, UserIdseller} = req.body;

            if (!PostId || !Rating) {
                return res.status(400).json({ message: "PostId and Rating are required" });
            }

            const [results] = await this.connection.query('CALL fn_rating(?, ?, ?, ?, ?)', [UserIdseller, PostId, Vote, Rating, TransactionId]);
            res.json(results[0]);
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

}

module.exports = new RatingController();