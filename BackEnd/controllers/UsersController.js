const mysql = require('mysql2/promise');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { Cookie } = require('express-session');

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

    hashPassword = (password) => {
        const hashed = crypto.createHash('sha256').update(password).digest('hex');
        console.log(`Hashed password for "${password}": ${hashed}`);
        return hashed;
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

    // /users/getUserById
    GetUserById = async (req, res) =>
    {   
        const token = req.headers.authorization?.split(" ")[1];
    
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        try 
        {
            const secretKey = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secretKey);
            const UserId = decoded.userId;

            const [results] = await this.connection.query('CALL fn_get_user_by_id(?)', [UserId]);
            res.json(results[0]);
        } 
        catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

    // [POST] /users/createUser
    CreateUser = async (req, res) =>
    {
        const { Username, Fullname, Password, Email, PhoneNumber, UserRoleId, AvgRate  } = req.body;

        if (!Username || !Fullname || !Password || !Email || !PhoneNumber || !UserRoleId || !AvgRate){
            return res.status(400).json({error: 'Username, Fullname, PasswordHash, Email, PhoneNumber, UserRoleId, and AvgRate are required in request body'});
        }
        var hashedPassword = this.hashPassword(Password);
        try{
            const [results] = await this.connection.query('CALL fn_create_user(?, ?, ?, ?, ?, ?, ?)', [Username, Fullname, hashedPassword, Email, PhoneNumber, UserRoleId, AvgRate]);
            res.json(results[0]);
        }catch(error){
            console.error('Error creating user:', error);
            return res.status(500).json({error: 'Error creating user'});
        }
    }

    //[GET] /users/login
    GetLogin = async (req, res) =>
    {
        res.render('login');
    }

    // [POST] /users/login
    PostLogin = async (req, res) =>
    {
        const { Username, Password } = req.body;

        if (!Username || !Password){
            return res.status(400).json({error: 'Username and Password are required in request body'});
        }
        var hashedPassword = this.hashPassword(Password);

        try{
            const [results] = await this.connection.query('CALL fn_login(?, ?)', [Username, hashedPassword]);
            if (results[0][0] && results[0][0].Message == "Login Successful"){

                console.log("Login successful");

                // Lưu thông tin người dùng vào session
                req.session.user = {
                    UserId: results[0][0].UserId,
                    Username: Username,
                    Email: results[0][0].Email
                };

                console.log("Session ID:", req.sessionID);
                console.log("Session data:", req.session.user);
                // Lưu thông tin người dùng vào Redis

                // Tạo access token
                const access_token = jwt.sign({
                    userId: results[0][0].UserId,
                    username: Username,
                    email: results[0][0].Email,}, 
                    process.env.JWT_SECRET,
                    {expiresIn: process.env.JWT_EXPIRE});

                res.cookie('key', 123);

                res.cookie('session_id', req.sessionID, {
                    maxAge: 1000 * 60 * 60, // 1 hour
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
                    sameSite: 'Strict' // Only send cookie in the same site
                });

                res.json({state:"success", access_token: access_token});

                console.log("Access token:", access_token);

                return;
            }
            else{
                return res.status(401).json({ error: 'Username or Password is incorrect' });
            }
        }catch(error){
            console.error('Error logging in:', error);
            return res.status(500).json({error: 'Error logging in'});
        }
    }

    // [POST] /users/changePassword
    ChangePassword = async (req, res) =>
    {
        const { OldPassword, NewPassword } = req.body;
        const token = req.headers['authorization']?.split(" ")[1];

        if (!token){
            return res.status(401).json({error: 'Unauthorized'});
        }
        if (!OldPassword || !NewPassword){
            return res.status(400).json({error: 'UserId, OldPassword, and NewPassword are required in request body'});
        }
        var hashedOldPassword = this.hashPassword(OldPassword);
        var hashedNewPassword = this.hashPassword(NewPassword);

        try{
            var secretKey = process.env.JWT_SECRET;
            var decode = jwt.verify(token, secretKey);
            var Username = decode.username;

            const [results] = await this.connection.query('CALL fn_change_password(?, ?, ?)', [Username, hashedOldPassword, hashedNewPassword]);
            if (results[0][0] && results[0][0].Message == "Change Password Successfully"){
                return res.json(results[0][0].Message);
            }
            else{
                return res.status(401).json({ error: 'UserId or OldPassword is incorrect' });
            }
        }catch(error){
            console.error('Error changing password:', error);
            return res.status(500).json({error: 'Error changing password'});
        }
    }

    // [GET] /users/getUserBalance
    GetUserBalance = async (req, res) => {
        const token = req.headers.authorization?.split(" ")[1];
    
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
    
        try {
            const secretKey = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secretKey);
            const userId = decoded.userId;
    
            const [result] = await this.connection.execute("CALL fn_get_user_balance(?)", [userId]);
    
            if (!result[0] || result[0].length === 0) {
                return res.status(404).json({ message: "User not found" });
            }
    
            return res.status(200).json({ message: "Success", balance: result[0][0].AccountBalance });
        } catch (error) {
            console.error('Query error:', error);
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };

    // [GET] /users/session
    GetSession = async (req, res) =>
        {
            const sessionId = req.cookies['session_id'];
    
            if (!sessionId) {
                return res.status(400).json({ error: 'Session ID is required' });
            }
    
            this.redisClient.get(`sess:${sessionId}`, (err, sessionData) => {
                if (err) {
                    console.error('Error fetching session:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                if (sessionData) {
                    const session = JSON.parse(sessionData);
                    res.json({ session });
                } else {
                    res.status(404).json({ error: 'Session not found' });
                }
            });
        }
}

module.exports = new UsersController();
