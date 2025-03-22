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

    // [POST] /users/createUser
    CreateUser = async (req, res) =>
    {
        const { Username, Fullname, PasswordHash, Email, PhoneNumber, UserRoleId, AvgRate  } = req.body;
        const token = req.headers['authorization'];

        if (!token){
            return res.status(401).json({error: 'Unauthorized'});
        }

        if (!Username || !Fullname || !PasswordHash || !Email || !PhoneNumber || !UserRoleId || !AvgRate){
            return res.status(400).json({error: 'Username, Fullname, PasswordHash, Email, PhoneNumber, UserRoleId, and AvgRate are required in request body'});
        }

        try{
            const [results] = await this.connection.query('CALL fn_create_user(?, ?, ?, ?, ?, ?, ?)', [Username, Fullname, PasswordHash, Email, PhoneNumber, UserRoleId, AvgRate]);
            res.json(results[0]);
        }catch(error){
            console.error('Error creating user:', error);
            return res.status(500).json({error: 'Error creating user'});
        }
    }

}

module.exports = new UsersController;
