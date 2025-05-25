const axios = require('axios');
const crypto = require('crypto');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();


class MomoPaymentController {
    constructor() {
        this.partnerCode = "MOMO";
        this.accessKey = "F8BBA842ECF85";
        this.secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        this.requestId = this.partnerCode + new Date().getTime();
        this.orderId = this.requestId;
        this.redirectUrlBalance = "http://localhost:3000/payment/momo/redirect/balance";
        this.redirectUrlVoucher = "http://localhost:3000/payment/momo/redirect/voucher";
        this.ipnUrl = " http://127.0.0.1:3000/payment/momo/ipn";
        this.orderInfo = "pay with MoMo";
        this.requestType = "captureWallet";
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

        } catch (err) {
            console.error('Database connection error:', err);
        }
    }

    generateSignature(params) {
        const rawSignature = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');

        return crypto.createHmac('sha256', this.secretKey)
            .update(rawSignature)
            .digest('hex');
    }

    createPaymentRequest(amount, orderInfo, extraData = "") {


        const requestId = this.partnerCode + new Date().getTime();
        const orderId = requestId;

        const params = {
            accessKey: this.accessKey,
            amount: amount,
            extraData: extraData,
            ipnUrl: this.ipnUrl,
            orderId: orderId,
            orderInfo: orderInfo,
            partnerCode: this.partnerCode,
            redirectUrl: this.redirectUrlBalance,
            requestId: requestId,
            requestType: "captureWallet"
        };

        const signature = this.generateSignature(params);

        const requestBody = {
            ...params,
            signature: signature,
            lang: 'en'
        };

        return requestBody;
    }

    createPaymentRequestForVoucher(amount, orderInfo, extraData = "") {


        const requestId = this.partnerCode + new Date().getTime();
        const orderId = requestId;

        const params = {
            accessKey: this.accessKey,
            amount: amount,
            extraData: extraData,
            ipnUrl: this.ipnUrl,
            orderId: orderId,
            orderInfo: orderInfo,
            partnerCode: this.partnerCode,
            redirectUrl: this.redirectUrlVoucher,
            requestId: requestId,
            requestType: "captureWallet"
        };

        const signature = this.generateSignature(params);

        const requestBody = {
            ...params,
            signature: signature,
            lang: 'en'
        };

        return requestBody;
    }

    async sendPaymentRequest(requestBody) {
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
            },
            data: requestBody
        };

        try {
            const response = await axios(options);
            return response.data;
        } catch (error) {
            console.error("Error sending payment request:", error);
            throw error;
        }
    }

    async UpdateVoucherId(extraData) {
        try {
            if (!this.connection) {
                console.error('Database connection not initialized');
                throw new Error('Database connection not initialized');
            }

            // Parse extraData
            let parsedData;
            try {
                parsedData = JSON.parse(extraData);
            } catch (error) {
                console.error('Invalid extraData format:', error.message);
                throw new Error('Invalid extraData format');
            }

            const { cartData, userIdBuyer } = parsedData;

            if (!cartData || !Array.isArray(cartData) || cartData.length === 0 || !userIdBuyer) {
                console.error('Missing or invalid cartData or userIdBuyer in extraData');
                throw new Error('Missing or invalid cartData or userIdBuyer');
            }

            console.log('Updating cart transaction:', { cartData, userIdBuyer });

            // Chuyển cartData thành chuỗi JSON
            const cartDataJson = JSON.stringify(cartData);

            // Gọi stored procedure fn_create_momo_cart_transaction
            const query = 'CALL fn_create_momo_cart_transaction(?, ?)';
            const [result] = await this.connection.query(query, [cartDataJson, userIdBuyer]);

            console.log(`Updated cart transaction for user ${userIdBuyer}`);
            return { success: true, message: result[0]?.Message, lastTransactionId: result[0]?.LastTransactionId };
        } catch (error) {
            console.error('Error updating cart transaction:', error.message, error.stack);
            throw error;
        }
    }

    async UpdateBalance(userId, amount) {
        try {
            if (!this.connection) {
                console.error('Database connection not initialized');
                throw new Error('Database connection not initialized');
            }

            const query = 'UPDATE `User` SET AccountBalance = AccountBalance + ? WHERE UserId = ?';
            const [result] = await this.connection.query(query, [amount, userId]);

            if (result.affectedRows === 0) {
                console.error(`User ${userId} not found`);
                throw new Error(`User ${userId} not found`);
            }

            console.log(`Updated balance for user ${userId}, amount: ${amount}`);
            return { success: true };
        } catch (error) {
            console.error('Error updating balance:', error.message, error.stack);
            throw error;
        }
    }

    async handleIPN(req) {
        console.log('Handling IPN with body:', req.body); // Log yêu cầu để debug
        const requiredFields = [
            'partnerCode', 'orderId', 'requestId', 'amount', 'orderInfo',
            'orderType', 'transId', 'resultCode', 'message', 'payType',
            'responseTime', 'extraData', 'signature'
        ];

        // 1. Kiểm tra tham số đầu vào
        for (const field of requiredFields) {
            if (!(field in req.body)) {
                console.error(`Missing required field: ${field}`);
                throw new Error(`Missing required field: ${field}`);
            }
        }

        const {
            partnerCode,
            orderId,
            requestId,
            amount,
            orderInfo,
            orderType,
            transId,
            resultCode,
            message,
            payType,
            responseTime,
            extraData,
            signature
        } = req.body;

        // 2. Xác minh chữ ký
        const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
        const computedSignature = crypto
            .createHmac('sha256', this.secretKey)
            .update(rawSignature)
            .digest('hex');

        if (computedSignature !== signature) {
            console.error('Invalid signature:', { computedSignature, receivedSignature: signature });
            throw new Error('Invalid signature');
        }

        // 3. Kiểm tra extraData
        if (!extraData) {
            console.error('extraData is empty or undefined');
            throw new Error('extraData is required');
        }

        // 4. Kiểm tra trạng thái giao dịch
        if (resultCode === 0) {
            // Giao dịch thành công
            console.log(`Transaction successful for order ${orderId}`);
            const userId = extraData;

            // Kiểm tra kết nối database
            if (!this.connection) {
                console.error('Database connection not initialized');
                throw new Error('Database connection not initialized');
            }

            const query = 'UPDATE `User` SET Balance = Balance + ? WHERE UserId = ?';
            const [result] = await this.connection.query(query, [amount, userId]);

            if (result.affectedRows === 0) {
                console.error(`User ${userId} not found`);
                throw new Error(`User ${userId} not found`);
            }

            console.log(`Updated balance for user ${userId}, amount: ${amount}`);
        } else {
            console.error(`Transaction failed for order ${orderId}: ${message}`);
            throw new Error(`Transaction failed: ${message}`);
        }

        return { success: true };
    }
}

module.exports = new MomoPaymentController;