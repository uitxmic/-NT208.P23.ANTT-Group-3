const mysql = require('mysql2/promise');
require('dotenv').config();

class UsersController
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

            console.log('Connected to the database (async)');
        } catch (err) {
            console.error('Database connection error:', err);
        }
    }
    // [Get] /users/getUsers
    GetAllUser = async (req, res) =>
    {
        try 
        {
            const [results] = await this.connection.query('CALL get_all_users()');
            res.json(results[0]); // Chỉ trả về kết quả SELECT
        } 
        catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

    // [POST] /users/getUserById
    GetUserById = async (req, res) =>
    {
        const { UserId } = req.body;

        if (!UserId)
        {
        return res.status(400).json({ error: 'UserId is required in request body' });
        }

        try 
        {
            const [results] = await this.connection.query('CALL fn_get_user_by_id(?)', [UserId]);
            res.json(results[0]); // Chỉ trả về kết quả SELECT
        } 
        catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

}

module.exports = new UsersController;
