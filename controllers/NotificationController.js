const mysql = require('mysql2/promise');
require('dotenv').config();
const connectDB = require('../src/config/connectDB.js');

class NotificationController
{
    constructor()
    {
        this.connection = connectDB;
    }

    // [Get] /notification
    Get20LastestNotifications = async (req, res) =>
    {
        try 
        {
            const [results] = await this.connection.query('CALL fn_get_20_lastest_notifications()');
            res.json(results[0]); // Chỉ trả về kết quả SELECT
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
