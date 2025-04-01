const mysql = require('mysql2/promise');
require('dotenv').config();

class NotificationController
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
    // [Get] /notification
    Get20LastestNotifications = async (req, res) =>
    {
        try 
        {
            const [results] = await this.connection.query('CALL fn_get_20_lastest_notifications()');
            res.status(200).json(results[0]); // Chỉ trả về kết quả SELECT
        } 
        catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

    // [Get] /notification/getNotiById/:NotiId
    GetNotificationsByUserId = async (req, res) =>
    {
        try 
        {
            const { NotiId } = req.params;
            if(!NotiId)
            {
                return res.status(400).json({ error: 'Missing NotiId' });
            }
            const [results] = await this.connection.query('CALL fn_get_notification_by_id(?)', [NotiId]);
            res.json(results[0]); // Chỉ trả về kết quả SELECT
        } 
        catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }
}

module.exports = new NotificationController;
