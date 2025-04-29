const mysql = require('mysql2/promise');
require('dotenv').config();

class TradeController
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
