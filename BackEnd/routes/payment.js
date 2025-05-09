const express = require('express');
const MomoPaymentController = require('../controllers/MomoPaymentController');
const voucherController = require('../controllers/VoucherController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/momo/redirect/balance', async (req, res) => {
    console.log('Received redirect from MoMo:', req.query); 
    try {
        const { resultCode, amount, extraData, orderId } = req.query;
        const money = amount/1000;
        await MomoPaymentController.UpdateBalance(extraData, money);

        if (resultCode === '0') {
            // Giao dịch thành công, Balance đã được cập nhật qua IPN
            console.log(`Payment successful for order ${orderId}`);
            // Chuyển hướng đến UserProfile
            return res.redirect('http://localhost:5173/profile');
        } else {
            console.error(`Payment failed for order ${orderId}, resultCode: ${resultCode}`);
            return res.status(400).json({ error: 'Payment failed' });
        }
    } catch (error) {
        console.error('Error in redirect handler:', error.message, error.stack);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/momo/redirect/voucher', async (req, res) => {
    console.log('Received redirect from MoMo:', req.query); 
    try {
        const { resultCode, amount, extraData, orderId } = req.query;
        const money = amount/1000;

        const { userId, voucherId, postId } = JSON.parse(extraData);
        console.log('Parsed extraData:', { userId, voucherId, postId });

        await MomoPaymentController.UpdateVoucherId(userId, voucherId, postId);

        if (resultCode === '0') {
            // Giao dịch thành công, Balance đã được cập nhật qua IPN
            console.log(`Payment successful for order ${orderId}`);
            // Chuyển hướng đến UserProfile
            return res.redirect('http://localhost:5173/profile');
        } else {
            console.error(`Payment failed for order ${orderId}, resultCode: ${resultCode}`);
            return res.status(400).json({ error: 'Payment failed' });
        }
    } catch (error) {
        console.error('Error in redirect handler:', error.message, error.stack);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Middleware to check authentication
router.use(authMiddleware);

router.post('/create-payment', async (req, res) => {
    const { amount, UserId } = req.body;

    if (!amount || !UserId) {
        return res.status(400).json({ error: 'Missing amount or userId' });
    }

    try {
        const requestBody = MomoPaymentController.createPaymentRequest(
            amount,
            `Nạp tiền cho người dùng ${UserId}`,
            UserId
        );
        const response = await MomoPaymentController.sendPaymentRequest(requestBody);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/create-payment-voucher', async (req, res) => {
    const { amount, userId, voucherId, postId } = req.body;

    if (!amount || !userId || !voucherId) {
        return res.status(400).json({ error: 'Missing amount, userId, or voucherId' });
    }

    try {
        console.log('Received request to create payment for voucher:', req.body);
        const voucher = await voucherController.GetVoucherById(voucherId);
        if (!voucher) {
            return res.status(404).json({ error: 'Voucher not found' });
        }

        const voucherName = voucher[0].VoucherName;
        const extraData = JSON.stringify({ voucherId, postId, userId });

        const requestBody = MomoPaymentController.createPaymentRequestForVoucher(
            amount,
            `Thanh toán voucher ${voucherName}`,
            extraData
        );
        const response = await MomoPaymentController.sendPaymentRequest(requestBody);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/momo/ipn', async (req, res) => {
    try {
        await MomoPaymentController.handleIPN(req); // Gọi hàm handleIPN (chữ hoa)
        return res.status(204).send(); // Trả về 204 theo yêu cầu MoMo
    } catch (error) {
        console.error('IPN error:', error.message);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;