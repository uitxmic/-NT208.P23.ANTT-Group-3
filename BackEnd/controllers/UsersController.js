const { initConnection } = require('../middlewares/dbConnection');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

class UsersController {
    constructor() {
        this.initConnection();
        this.transporter = null;
        this.initMailer();
        this.init();
    }

    async init() {
        this.connection = await initConnection();
    }

    initMailer() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'khoibaochien@gmail.com',
                pass: process.env.EMAIL_PASS
            }
        });
    }

    hashPassword = (password) => {
        const hashed = crypto.createHash('sha256').update(password).digest('hex');
        console.log(`Hashed password for "${password}": ${hashed}`);
        return hashed;
    }

    // Hàm tạo mật khẩu ngẫu nhiên
    generateRandomPassword = (length = 8) => {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }

    // [POST] /users/forgot-password
    ForgotPassword = async (req, res) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email là bắt buộc.' });
        }

        try {
            // Kiểm tra xem email có tồn tại không
            const [users] = await this.connection.query('SELECT * FROM User WHERE Email = ?', [email]);

            if (users.length === 0) {
                return res.status(404).json({ message: 'Email không tồn tại.' });
            }

            const user = users[0];

            // Tạo mật khẩu ngẫu nhiên
            const randomPassword = this.generateRandomPassword();
            const hashedRandomPassword = this.hashPassword(randomPassword);

            // Cập nhật mật khẩu mới vào cơ sở dữ liệu
            await this.connection.query('UPDATE User SET PasswordHash = ? WHERE Email = ?', [hashedRandomPassword, email]);

            // Gửi email chứa mật khẩu ngẫu nhiên
            const mailOptions = {
                from: 'VoucherHub <khoibaochien@gmail.com>',
                to: email,
                subject: 'Yêu cầu Đặt lại Mật khẩu - VoucherHub',
                html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Đặt lại Mật khẩu VoucherHub</title>
            <style>
                body {
                    font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border-top: 5px solid #007bff; /* Màu chủ đạo của VoucherHub, có thể thay đổi */
                }
                .header {
                    text-align: center;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #eeeeee;
                    margin-bottom: 20px;
                }
                .header h1 {
                    color: #007bff; /* Màu chủ đạo */
                    font-size: 28px;
                    margin: 0;
                    padding: 0;
                }
                .content p {
                    margin-bottom: 15px;
                }
                .password-box {
                    background-color: #e9ecef;
                    padding: 15px 20px;
                    border-radius: 5px;
                    text-align: center;
                    margin: 25px 0;
                }
                .password-box strong {
                    font-size: 24px;
                    color: #d9534f; /* Màu nổi bật cho mật khẩu */
                    letter-spacing: 1px; /* Tạo khoảng cách giữa các ký tự */
                }
                .button-container {
                    text-align: center;
                    margin-top: 30px;
                }
                .button {
                    display: inline-block;
                    background-color: #007bff; /* Màu chủ đạo */
                    color: #ffffff !important; /* Quan trọng để đảm bảo màu trắng */
                    padding: 12px 25px;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 16px;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eeeeee;
                    font-size: 12px;
                    color: #777777;
                }
                .footer p {
                    margin: 5px 0;
                }
                .footer a {
                    color: #007bff;
                    text-decoration: none;
                }
                .security-note {
                    background-color: #fff3cd; /* Màu vàng nhạt */
                    border-left: 5px solid #ffe066; /* Màu vàng đậm */
                    padding: 15px;
                    border-radius: 4px;
                    margin-top: 25px;
                    font-size: 14px;
                    color: #856404; /* Màu chữ đậm */
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>VoucherHub</h1>
                </div>
                <div class="content">
                    <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản VoucherHub của bạn. Dưới đây là mật khẩu tạm thời:</p>

                    <div class="password-box">
                        <p><strong>Mật khẩu tạm thời của bạn:</strong></p>
                        <p><strong>${randomPassword}</strong></p>
                    </div>

                    <p>Vui lòng sử dụng mật khẩu này để đăng nhập vào tài khoản của bạn. Vì lý do bảo mật, chúng tôi khuyến nghị bạn nên **đổi mật khẩu mới ngay lập tức** sau khi đăng nhập thành công.</p>

                    <div class="security-note">
                        <p><strong>Lưu ý bảo mật:</strong> Nếu bạn không yêu cầu đặt lại mật khẩu này, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn. Tuy nhiên, nếu bạn lo ngại, hãy liên hệ với đội ngũ hỗ trợ của chúng tôi ngay lập tức.</p>
                    </div>
                </div>

                <div class="footer">
                    <p>Trân trọng,</p>
                    <p>Đội ngũ VoucherHub</p>
                    <p><a href="${process.env.APP_HOST}">Trang chủ VoucherHub</a> | <a href="mailto:khoibaochien@gmail.com">Liên hệ hỗ trợ</a></p>
                    <p>&copy; ${new Date().getFullYear()} VoucherHub. Tất cả các quyền được bảo lưu.</p>
                </div>
            </div>
        </body>
        </html>
    `
            };

            await this.transporter.sendMail(mailOptions);

            return res.status(200).json({ message: 'Mật khẩu tạm thời đã được gửi qua email.' });
        } catch (error) {
            console.error('Lỗi:', error);
            return res.status(500).json({ message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' });
        }
    }

    // [Get] /users/getUsers
    GetAllUser = async (req, res) => {
        if (!req.session.user || req.session.user.UserRoleId !== 1) {
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
        let token = req.headers.authorization;
        let userId;

        // Kiểm tra token
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Xử lý Bearer token
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized: No session found" });
        }

        try {
            // Trường hợp 1: ID được truyền qua URL params (xem profile người khác)
            if (req.params && req.params.id) {
                userId = req.params.id;
                if (isNaN(userId)) {
                    return res.status(400).json({ error: 'Invalid userId, must be a number' });
                }
            }
            // Trường hợp 2: Dùng ID từ token (xem profile bản thân)
            else {
                const secretKey = process.env.JWT_SECRET;
                const decoded = jwt.verify(token, secretKey);
                userId = decoded.userId;
            }

            // Gọi stored procedure để lấy thông tin người dùng
            const [results] = await this.connection.query('CALL fn_get_user_by_id(?)', [parseInt(userId)]);

            // Kiểm tra kết quả
            if (results[0] && results[0].length > 0) {
                res.json(results[0]);
            } else {
                return res.status(404).json({ message: "User not found" });
            }
        }
        catch (error) {
            console.error('Error in GetUserById:', error);
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Invalid or expired token", details: error.message });
            }
            res.status(500).json({ error: 'Internal server error', details: error.message });
        }
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
            if (results[0][0] && results[0][0].Message == "Change Password Successfully") {
                return res.json({ 'Message': results[0][0].Message });
            }
            else {
                return res.status(401).json({ error: 'UserId or OldPassword is incorrect' });
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
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Unauthorized : No active session" });
        }
        const userId = req.session.user.UserId;
                
        try {
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