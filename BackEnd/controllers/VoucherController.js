const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class VoucherController
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
            const jwt = require('jsonwebtoken');

            const user = {
                UserId: 2,
                Username: 'user2',
                role: 'user'
            };

            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

            console.log('Test token:', token);
        } catch (err) {
            console.error('Database connection error:', err);
        }
    }

    // [GET] /voucher/getVoucherByUserId/:UserId
    GetVoucherByUserId = async (req, res) =>
    {
        const { UserId } = req.params;
        const token = req.headers['authorization'];

        if (!token)
        {
            return res.status(401).json({ error: 'Unauthorized' });
        }


        if (!UserId)
        {
            return res.status(400).json({ error: 'UserId is required in request params' });
        }

        try 
        {
            var secretKey = process.env.JWT_SECRET;
            var decoded = jwt.verify(token, secretKey);
            console.log('Decoded:', decoded);

            console.log('UserId:', UserId);
            console.log('Decoded UserId:', decoded.UserId);

            if (decoded.UserId !== Number(UserId)) {
                return res.status(403).json({ error: 'You are not allowed to access this user\'s data' });
              }
            
            const [results] = await this.connection.query('CALL fn_get_voucher_by_user_id(?)', [UserId]);
            res.json(results[0]);
        } 
        catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

    // [POST] /voucher/giveVoucher
    GiveVoucher = async (req, res) =>
        {
            const { recipient_phonenumber, voucher_name } = req.body;
            const token = req.headers.authorization?.split(" ")[1];
            console.log(req.headers.authorization);
    
            if (!token) {
                return res.status(401).json({ message: "Unauthorized: No token provided" });
            }
    
            try {
                const secretKey = process.env.JWT_SECRET;
                const decoded = jwt.verify(token, secretKey);
                const Sender_ID = decoded.UserId;
    
                if (!recipient_phonenumber || !voucher_name) {
                    return res.status(400).json({ message: "Recipient phone number and voucher name are required in request body" });
                }
    
                const [result] = await this.connection.execute("CALL fn_giveaway(?, ?, ?)", [recipient_phonenumber, Sender_ID, voucher_name]);
                return res.json(result[0]);
            } catch (error) {
                console.error('Query error:', error);
                return res.status(500).json({ message: "Internal Server Error", error: error.message });
            }
        }

    // [GET] /voucher/getValidVoucher
    GetValidVouchers = async (req, res) => {
        const token = req.headers.authorization?.split(" ")[1];
    
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
    
        try {
            const secretKey = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secretKey);
            const userId = decoded.UserId;
    
            // Truyền userId vào stored procedure
            const [result] = await this.connection.execute("CALL fn_get_all_valid_vouchers(?)", [userId]);
    
            // Kiểm tra kết quả trả về
            if (!result[0] || result[0].length === 0) {
                return res.status(200).json({ message: "No valid vouchers found", data: [] });
            }
    
            return res.status(200).json({ message: "Success", data: result[0] });
        } catch (error) {
            console.error('Query error:', error);
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };

    GetValidUserVouchers = async (req, res) => {
        const token = req.headers.authorization?.split(" ")[1];
    
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
    
        try {
            const secretKey = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secretKey);
            const userId = decoded.UserId;
    
            // Truyền userId vào stored procedure
            const [result] = await this.connection.execute("CALL fn_get_all_valid_User_vouchers(?)", [userId]);
    
            // Kiểm tra kết quả trả về
            if (!result[0] || result[0].length === 0) {
                return res.status(200).json({ message: "No valid user's vouchers found", data: [] });
            }
    
            return res.status(200).json({ message: "Success", data: result[0] });
        } catch (error) {
            console.error('Query error:', error);
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };
}

module.exports = new VoucherController;