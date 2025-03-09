const mysql = require('mysql2');
require('dotenv').config();

class UsersController
{
    constructor()
    {
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        this.connection.connect((err) => {
            if (err) {
                console.error('Error connecting to the database:', err);
                return;
            }
            console.log('Connected to the database');
        });
    }
    // [Get] /users
    GetAllUser = (req, res) =>
    {
        this.connection.query('SELECT * FROM Users', (error, results, fields) => {
            if (error) {
                res.status(500).json({ error: 'Database query error' });
                return;
            }
            res.json(results);
        });
    }
}

module.exports = new UsersController;
