const { initConnection } = require('../middlewares/dbConnection');
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // Ensure jwt is imported

class UsersController {
    constructor() {
        this.init();
    }

    async init() {
        this.connection = await initConnection();
    }

    hashPassword = (password) => {
        const hashed = crypto.createHash('sha256').update(password).digest('hex');
        console.log(`Hashed password for "${password}": ${hashed}`);
        return hashed;
    }

    // [Get] /users/getUsers
    GetAllUser = async (req, res) => {
        if (!req.session.user || req.session.user.userRoleId !== 1) {
            return res.status(403).json({ message: "Forbidden: You do not have permission to access this resource" });
        }

        try {
            const { sortBy = 'UserId', sortOrder = 'DESC', searchTerm = '' } = req.query;
            const [results] = await this.connection.query('CALL fn_get_all_user_for_admin(?, ?, ?)', [sortBy, sortOrder, searchTerm]);
            res.json(results[0]);
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

    // /users/getUserById
    GetUserById = async (req, res) => {
        let userId;

        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: No session found" });
        }

        try {
            if (req.params && req.params.id) {
                userId = req.params.id;
                if (isNaN(userId)) {
                    return res.status(400).json({ error: 'Invalid userId, must be a number' });
                }
            } else {
                userId = req.session.user.UserId;
            }

            const [results] = await this.connection.query('CALL fn_get_user_by_id(?)', [parseInt(userId)]);

            if (results[0] && results[0].length > 0) {
                res.json(results[0]);
            } else {
                return res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            console.error('Error in GetUserById:', error);
            res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    }
    // [POST] /users/createUser
    CreateUser = async (req, res) => {
        const { Username, Fullname, Password, Email, PhoneNumber } = req.body;

        if (!Username || !Fullname || !Password || !Email || !PhoneNumber) {
            return res.status(400).json({
                error: 'Username, Fullname, Password, Email, and PhoneNumber are required in request body'
            });
        }
        const hashedPassword = this.hashPassword(Password);


        try {
            const [results] = await this.connection.query(
                'CALL fn_create_user(?, ?, ?, ?, ?)',
                [Username, Fullname, hashedPassword, Email, PhoneNumber]
            );
            res.json(results[0]);
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ error: 'Error creating user' });
        }

    };

    //[GET] /users/login
    GetLogin = async (req, res) => {
        res.render('login');
    }

    // [POST] /users/login
    PostLogin = async (req, res) => {
        const { Username, Password } = req.body;

        if (!Username || !Password) {
            return res.status(400).json({ error: 'Username and Password are required in request body' });
        }
        var hashedPassword = this.hashPassword(Password);

        try {
            const [results] = await this.connection.query('CALL fn_login(?, ?)', [Username, hashedPassword]);
            if (results[0][0] && results[0][0].Message == "Login Successful"){

                console.log("Login successful");

                // Lưu thông tin người dùng vào session
                req.session.user = {
                    UserId: results[0][0].UserId || '',
                    Username: Username || '',
                    Email: results[0][0].Email || '',
                    UserRoleId: results[0][0].UserRoleId || ''
                };

                res.cookie('session_id', req.sessionID, {
                    maxAge: 1000 * 60 * 60, // 1 hour
                    httpOnly: true, // Đảm bảo cookie chỉ truy cập được từ server
                    sameSite: 'Lax', // Cho phép cookie được gửi trong các yêu cầu cùng site
                });
                console.log("Session ID:", req.sessionID);
                console.log("Session user:", req.session.user);

                res.send("Đăng nhập thành công!");
            }
            else {
                return res.status(401).json({ error: 'Username or Password is incorrect' });
            }
        } catch (error) {
            console.error('Error logging in:', error);
            return res.status(500).json({ error: 'Error logging in' });
        }
    }

    // [POST] /users/changePassword
    ChangePassword = async (req, res) => {
        const { OldPassword, NewPassword } = req.body;

        if (!req.session || !req.session.user) {
            return res.status(401).json({ error: 'Unauthorized: No active session' });
        }

        if (!OldPassword || !NewPassword) {
            return res.status(400).json({ error: 'OldPassword and NewPassword are required in request body' });
        }

        const hashedOldPassword = this.hashPassword(OldPassword);
        const hashedNewPassword = this.hashPassword(NewPassword);

        try {
            const Username = req.session.user.Username;

            const [results] = await this.connection.query('CALL fn_change_password(?, ?, ?)', [Username, hashedOldPassword, hashedNewPassword]);
            if (results[0][0] && results[0][0].Message === "Change Password Successfully") {
                return res.json({ 'Message': results[0][0].Message });
            } else {
                return res.status(401).json({ error: 'OldPassword is incorrect' });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            return res.status(500).json({ error: 'Error changing password' });
        }
    }

    // [GET] /users/getUserBalance
    GetUserBalance = async (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Unauthorized: No active session" });
        }

        try {
            const userId = req.session.user.UserId;

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

    // [PATCH] /users/updateUser
    UpdateUser = async (req, res) => {
        const { Fullname, Email, PhoneNumber } = req.body;
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        try {
            const secretKey = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secretKey);
            const userId = decoded.userId;

            const [results] = await this.connection.query('CALL fn_update_user(?, ?, ?, ?)', [userId, Fullname, Email, PhoneNumber]);
            res.json(results[0]);
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

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

module.exports = new UsersController;