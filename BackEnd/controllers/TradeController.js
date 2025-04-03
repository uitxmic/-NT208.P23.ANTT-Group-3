const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
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

    // [UPDATE] /trade/paymentbybalance
    PaymentByBalance = async (req, res) => {
        const { VoucherId } = req.body;
        const token = req.headers['authorization']?.split(" ")[1];
      

      
        if (!token) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
      
        if (!VoucherId) {
          return res.status(400).json({ error: 'VoucherId is required in request body' });
        }
      
        try {
          var secretKey = process.env.JWT_SECRET;
          var decode = jwt.verify(token, secretKey);
          var UserId = decode.UserId;
      
          const [result] = await this.connection.execute('CALL fn_payment_by_userbalance(?, ?)', [UserId, VoucherId]);
      
          const message = result[0][0]?.message;
      
          if (message === 'Payment successful') {
            return res.status(200).json({ message: 'Success' });
          } else {
            return res.status(400).json({ error: message });
          }
        } catch (error) {
          console.error('Error processing payment:', error);
          return res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
      }
    }

module.exports = new TradeController;
