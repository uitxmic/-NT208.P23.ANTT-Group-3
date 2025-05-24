const express = require('express');
const MomoPaymentController = require('../controllers/MomoPaymentController');
const voucherController = require('../controllers/VoucherController');
const postController = require('../controllers/PostingController');
const cartController = require('../controllers/CartController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/momo/redirect/balance', async (req, res) => {
    console.log('Received redirect from MoMo:', req.query);
    try {
        const { resultCode, amount, extraData, orderId } = req.query;
        const money = amount / 1000;
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
        const { resultCode, extraData, orderId } = req.query;

        // Kiểm tra extraData
        let parsedData;
        try {
            parsedData = JSON.parse(extraData);
        } catch (error) {
            console.error('Invalid extraData format:', error.message);
            return res.status(400).json({ error: 'Invalid extraData format' });
        }

        const { cartData, userIdBuyer } = parsedData;
        if (!cartData || !Array.isArray(cartData) || cartData.length === 0 || !userIdBuyer) {
            console.error('Missing or invalid cartData or userIdBuyer in extraData');
            return res.status(400).json({ error: 'Missing or invalid cartData or userIdBuyer' });
        }

        console.log('Parsed extraData:', { cartData, userIdBuyer });

        if (resultCode === '0') { // MoMo báo giao dịch thành công
            console.log(`Payment successful for order ${orderId}. Processing updates.`);

            // Gọi UpdateVoucherId với extraData
            // Giả định MomoPaymentController.UpdateVoucherId cũng sẽ throw error nếu thất bại
            await MomoPaymentController.UpdateVoucherId(extraData);
            console.log('UpdateVoucherId successful.');

        
            for (const item of cartData) {
                if (item.ItemId !== undefined) { // Đảm bảo ItemId tồn tại
                   
                    await cartController.UpdateCartTransaction(userIdBuyer, item.ItemId, 0);
                    console.log(`Successfully called UpdateCartTransaction for ItemId: ${item.ItemId}`);
                } else {
                    console.warn('Skipping cart update for an item due to missing ItemId:', item);
                }
            }

            console.log(`All updates processed for successful payment of order ${orderId}`);
            return res.redirect('http://localhost:5173/user-vouchers');
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
    const { cartData, userIdBuyer } = req.body;

    if (!cartData || !userIdBuyer) {
        return res.status(400).json({ error: 'Missing cartData or userIdBuyer' });
    }

    try {
        console.log('Received request to create payment for voucher:', req.body);
        let totalAmount = 0;
        const voucherNames = [];

        for (const item of cartData) {
            const { VoucherId, PostId, Quantity, UserIdSeller, ItemId } = item;

            if (!VoucherId || !PostId || !Quantity || !UserIdSeller || !ItemId) {
                return res.status(400).json({ error: 'Invalid cart item data' });
            }

            // Lấy thông tin voucher và giá
            const voucher = await voucherController.GetVoucherById(VoucherId);
            if (!voucher || voucher.length === 0) {
                return res.status(404).json({ error: `Voucher ${VoucherId} not found` });
            }

            const post = await postController.fetchPostingDataById(PostId); // Giả sử có hàm lấy post
            console.log('Post:', post);

            if (post && post[0] && post[0].result && post[0].result[0]) {
                console.log('PostId', post[0].result[0].PostId);
                if (post[0].result[0].UserId !== UserIdSeller) {
                    return res.status(404).json({ error: `Post ${PostId} not found or seller mismatch` });
                }
                if (post[0].result[0].Quantity < Quantity) {
                    return res.status(400).json({ error: `Not enough quantity for post ${PostId}` });
                }
                // Remove this line if the addition on line 135 is the correct one.
                // totalAmount += post[0].result[0].Price * Quantity; 
            } else {
                return res.status(404).json({ error: `Post ${PostId} not found or invalid structure` });
            }

            // Ensure Price and Quantity are numbers before calculation
            const priceValue = parseFloat(post[0].result[0].Price);
            const quantityValue = parseInt(Quantity, 10); // Or parseFloat if Quantity can be fractional

            // Check if conversion was successful
            if (isNaN(priceValue) || isNaN(quantityValue)) {
                console.error(`Invalid price or quantity for PostId ${PostId}. Price: ${post[0].result[0].Price}, Quantity: ${Quantity}`);
                return res.status(400).json({ error: `Invalid price or quantity for item with PostId ${PostId}.` });
            }

            console.log('Calculating item total. Price:', priceValue, 'Quantity:', quantityValue);
            // This line (originally 135) now correctly calculates the item's contribution.
            totalAmount += priceValue * quantityValue * 1000;
            voucherNames.push(voucher[0].VoucherName);
        }

        // Tạo extraData chứa cartData và userIdBuyer
        const extraData = JSON.stringify({ cartData, userIdBuyer });

        // Tạo yêu cầu thanh toán Momo
        console.log('Total amount:', totalAmount);
        const requestBody = MomoPaymentController.createPaymentRequestForVoucher(
            totalAmount,
            `Thanh toán giỏ hàng voucher ${voucherNames.join(', ')}`,
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