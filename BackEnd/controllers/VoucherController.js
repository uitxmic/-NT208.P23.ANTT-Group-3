const { initConnection } = require('../middlewares/dbConnection');
require('dotenv').config();

class VoucherController {
    constructor() {
        this.init();
    }

    async init() {
        this.connection = await initConnection();
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

            if (!voucherid || isNaN(voucherid)) {
                return res.status(400).json({ error: "Invalid voucherId, must be a number" });
            }

            const parsedVoucherId = parseInt(voucherid, 10);
            console.log('Fetching voucher with ID:', parsedVoucherId);

            const userId = req.session.user.UserId;

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

            const [result] = await this.connection.execute("CALL fn_add_voucher(?, ?, ?, ?, ?)", [VoucherName, userId, Category, ExpirationDay, VoucherCodes]);
            return res.json(result[0]);
        } catch (error) {
            console.error('Query error:', error);
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }

    UseVoucher = async (req, res) => {
        const { VoucherCode } = req.body;
        const token = req.headers.authorization?.split(" ")[1];

        if (!VoucherCode) {
            return res.status(400).json({ message: "Voucher code is required in request body" });
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        try {
            const secretKey = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secretKey);
            const UserId = decoded.userId;

            const [result] = await this.connection.execute("CALL fn_update_user_voucher(?, ?)", [UserId, VoucherCode]);

            if (!result || !result[0] || result[0].length === 0) {
                return res.status(500).json({ message: "Unexpected database response" });
            }

            const responseData = result[0];
            const firstRow = responseData[0];
            if (firstRow.Message === "No Voucher Found") {
                return res.status(400).json({ message: "Invalid voucher code or user ID" });
            }

            if (firstRow.Message === "Updating Failed") {
                return res.status(500).json({ message: "Failed to update voucher" });
            }

            return res.json({ message: "Success", data: responseData });
        } catch (error) {
            console.error('Query error:', error);
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };
}

module.exports = new VoucherController;