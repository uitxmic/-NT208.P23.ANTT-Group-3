const mysql = require('mysql2/promise');
require('dotenv').config();

class VoucherController {
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

    // function to get voucher called by momopayment
    async GetVoucherById(voucherId) {
        try {
            const [results] = await this.connection.query('CALL fn_get_voucher_by_id(?)', [voucherId]);
            return results[0];
        } catch (error) {
            console.error('Query error:', error);
            throw new Error('Database query error');
        }
    }

    // [GET] /voucher/getVoucherByUserId/:UserId
    GetVoucherByUserId = async (req, res) => {
        try {
            const UserId = req.session.user.UserId;

            const [results] = await this.connection.query('CALL fn_get_voucher_by_user_id(?)', [UserId]);
            res.json(results[0]);
        }
        catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

    // [POST] /voucher/giveVoucher
    GiveVoucher = async (req, res) => {
        const { recipient_phonenumber, voucher_name } = req.body;

        try {
            const Sender_ID = req.session.user.UserId;

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
        try {
            const userId = req.session.user.UserId;

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
        try {
            const userId = req.session.user.UserId;

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

    GetDetailUserVoucher = async (req, res) => {
        try {
            const { voucherid } = req.params;

            console.log('Received voucherId:', voucherid);

            // Kiểm tra voucherid có tồn tại và là số
            if (!voucherid || isNaN(voucherid)) {
                return res.status(400).json({ error: "Invalid voucherId, must be a number" });
            }

            const parsedVoucherId = parseInt(voucherid, 10);
            console.log('Fetching voucher with ID:', parsedVoucherId);

            const userId = req.session.user.UserId;

            // Truyền userId và voucherId vào stored procedure
            const [result] = await this.connection.execute(
                "CALL fn_get_detail_user_voucher(?, ?)",
                [userId, parsedVoucherId]
            );

            if (!result || !result[0] || result[0].length === 0) {
                return res.status(200).json({ message: "No voucher details found", data: [] });
            }

            return res.status(200).json({ message: "Success", data: result[0] });

        } catch (error) {
            console.error('Query error:', error);
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };

    // [POST] /voucher/addVoucher
    AddVoucher = async (req, res) => {
        const { VoucherName, Category, ExpirationDay, VoucherCodes } = req.body;

        try {
            const userId = req.session.user.UserId;

            if (!VoucherName || !Category || !ExpirationDay || !VoucherCodes) {
                return res.status(400).json({ message: "All fields are required in request body" });
            }

            const [result] = await this.connection.execute("CALL fn_add_voucher(?, ?, ?, ?, ?)", [VoucherName, userId, Category, ExpirationDay, VoucherCodes] );
            return res.json(result[0]);
        } catch (error) {
            console.error('Query error:', error);
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
}

module.exports = new VoucherController;