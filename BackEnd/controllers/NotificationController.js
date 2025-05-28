require('dotenv').config();
const { initConnection } = require('../middlewares/dbConnection');

class NotificationController {
    constructor() {
        this.init();
    }

    async init() {
        this.connection = await initConnection();
    }

    // [GET] /notification Lấy 5 thông báo mới nhất của user
    get5LatestNotifications = async (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Unauthorized: No session found" });
        }

        try {
            const userId = req.session.user.UserId;
            const [results] = await this.connection.query('CALL fn_get_5_latest_notifications(?)', [userId]);
            if (!results[0] || results[0].length === 0) {
                return res.status(404).json({ message: 'No notifications found' });
            }
            res.json(results[0]);
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

    // [GET] /notification/getNotiById/:notiId - Lấy thông báo theo noti_id
    getNotificationById = async (req, res) => {
        try {
            const { notiId } = req.params;
            console.log('Received notiId:', notiId);
            const parsedNotiId = parseInt(notiId, 10);
            console.log('Fetching notification with ID:', parsedNotiId);
            if (isNaN(parsedNotiId)) {
                return res.status(400).json({ error: 'Invalid notiId, must be a number' });
            }

            const [results] = await this.connection.query('CALL fn_get_notification_by_id(?)', [parsedNotiId]);
            if (!results[0] || results[0].length === 0) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.json(results[0][0]);
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

    // [POST] /notification/markAsRead/:notiId - Đánh dấu đã đọc
    markAsRead = async (req, res) => {
        try {
            const { notiId } = req.params;
            const parsedNotiId = parseInt(notiId, 10);
            if (isNaN(parsedNotiId)) {
                return res.status(400).json({ error: 'Invalid notiId, must be a number' });
            }

            const [results] = await this.connection.query(
                'UPDATE Noti SET is_read = 1, updated_at = CURRENT_TIMESTAMP WHERE noti_id = ? AND is_deleted = 0',
                [parsedNotiId]
            );

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Notification not found or already marked as read' });
            }

            res.status(200).json({ message: 'Notification marked as read' });
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    };

    // [GET] /notification/orders?userId=18 - Lấy tất cả thông báo loại "order"
    getAllOrderNotifications = async (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Unauthorized: No session found" });
        }

        try {
            const userId = req.session.user.UserId;
            const [results] = await this.connection.query('CALL fn_get_all_order_notifications(?)', [userId]);
            if (!results[0] || results[0].length === 0) {
                return res.status(404).json({ message: 'No order notifications found' });
            }

            res.json(results[0]);
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    };


    getAllSystemNotifications = async (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Unauthorized: No session found" });
        }

        try {
            const userId = req.session.user.UserId;
            const [results] = await this.connection.query('CALL fn_get_all_system_notifications(?)', [userId]);
            if (!results[0] || results[0].length === 0) {
                return res.status(404).json({ message: 'No system notifications found' });
            }

            res.json(results[0]);
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    };

    getAllWalletNotifications = async (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Unauthorized: No session found" });
        }

        try {
            const userId = req.session.user.UserId;
            const [results] = await this.connection.query('CALL fn_get_all_wallet_notifications(?)', [userId]);
            if (!results[0] || results[0].length === 0) {
                return res.status(404).json({ message: 'No wallet notifications found' });
            }

            res.json(results[0]);
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    };

    getAllPromotionNotifications = async (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Unauthorized: No session found" });
        }

        try {
            const userId = req.session.user.UserId;
            const [results] = await this.connection.query('CALL fn_get_all_promotion_notifications(?)', [userId]);
            if (!results[0] || results[0].length === 0) {
                return res.status(404).json({ message: 'No promotion notifications found' });
            }

            res.json(results[0]);
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    };
}

module.exports = new NotificationController();
