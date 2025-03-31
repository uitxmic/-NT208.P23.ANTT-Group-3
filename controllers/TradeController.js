const mysql = require('mysql2/promise');
require('dotenv').config();
const connectDB = require('../src/config/connectDB.js');

class TradeController
{
    constructor()
    {
        this.connection = connectDB;
    }

    // [Get] /trade
    Get20LastestPosts = async (req, res) =>
    {
        try 
        {
            const [results] = await this.connection.query('CALL fn_get_20_lastest_posts()');
            res.json(results[0]); // Chỉ trả về kết quả SELECT
        } 
        catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }

    }
}

module.exports = new TradeController;
