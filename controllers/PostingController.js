const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class PostingController
{
    constructor()
    {
        this.initConnection();
    }

    async initConnection() 
    {
        try {
            this.connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });

        } catch (err) {
            console.error('Database connection error:', err);
        }
    }

    // [POST] /posting/createPosting
    CreatePosting = async (req, res) =>
    {
        const { VoucherId, Postname, Content } = req.body;
        const token = req.headers['authorization'];

        if (!token)
        {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!VoucherId || !Postname || !Content)
        {
            return res.status(400).json({ error: 'VoucherId, Postname, and Content are required in request body' });
        }

        try 
        {
            const secretKey = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secretKey);
            const UserId = decoded.UserId;

            const [results] = await this.connection.query(`CALL fn_create_post(?, ?, ?, ?)`, [VoucherId, UserId, Postname, Content]);

            res.json(results[0]);

        } catch (err) {
            console.error('Error creating posting:', err);
            return res.status(500).json({ error: 'Error creating posting' });
        }
    }
}

module.exports = new PostingController();