const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class TradeController {
  constructor() {
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

      console.log('Connected to the database (async)');
    } catch (err) {
      console.error('Database connection error:', err);
    }
  }
  // [Get] /trade
  Get20LastestPosts = async (req, res) => {
    try {
      const [results] = await this.connection.query('CALL fn_get_20_lastest_posts()');
      res.json(results[0]);
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
      var UserId = decode.userId;

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

  // [POST] /trade/createTransaction
  CreateTransaction = async (req, res) => {
    const { VoucherId, PostId, Amount, UserIdSeller } = req.body;
    const token = req.headers['authorization'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!VoucherId || !PostId || !Amount || !UserIdSeller) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    try {
      var secretKey = process.env.JWT_SECRET;
      var decode = jwt.verify(token, secretKey);
      var UserIdBuyer = decode.userId;
      console.log('UserIdBuyer:', UserIdBuyer);
      console.log('VoucherId:', VoucherId);
      console.log('PostId:', PostId);
      console.log('Amount:', Amount);
      console.log('UserIdSeller:', UserIdSeller);

      const [result] = await this.connection.query('CALL fn_create_transaction(?, ?, ?, ?, ?)', [VoucherId, PostId, Amount, UserIdBuyer, UserIdSeller]);
      console.log('Result:', result);
      const message = result[0][0]?.Message;
      console.log('Message:', result[0][1]?.Message);

      if (message === 'Transaction Created') {
        return res.status(200).json({ message: 'Success' });
      } else {
        return res.status(400).json({ error: message });
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }

  // [GET] /trade/getTransactionForAdmin
  GetTransactionForAdmin = async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userRoleId = JSON.parse(atob(token.split('.')[1])).userRoleId;
    if (userRoleId != 1) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    try {
      var secretKey = process.env.JWT_SECRET;
      var decode = jwt.verify(token, secretKey);
      var UserRoleId = decode.userRoleId;
      if (UserRoleId != 1) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const [results] = await this.connection.query('CALL fn_get_all_transaction_for_admin()');
      res.json(results[0]); // Chỉ trả về kết quả SELECT
    } catch (error) {
      console.error('Query error:', error);
      res.status(500).json({ error: 'Database query error', details: error.message });
    }
  }
  // [PATCH] /trade/completeTransaction
  CompleteTransaction = async (req, res) => {
    const { TransactionId } = req.body;
    if (!TransactionId) {
      return res.status(400).json({ error: 'TransactionId is required in request body' });
    }

    const token = req.headers['authorization'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userRoleId = JSON.parse(atob(token.split('.')[1])).userRoleId;

    if (userRoleId != 1) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    try {
      var secretKey = process.env.JWT_SECRET;
      var decode = jwt.verify(token, secretKey);
      var UserRoleId = decode.userRoleId;
      if (UserRoleId != 1) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const [results] = await this.connection.query('CALL fn_complete_transaction(?)', [TransactionId]);
      const message = results[0][0]?.Message;
      const Id = results[0][0]?.Id;
      console.log('Id:', Id);
      console.log('Message:', message);
      if (Id === 1)
        return res.status(200).json({ message: 'Success' });
      else
        return res.status(400).json({ error: message.error });
    } catch (error) {
      console.error('Query error:', error);
      res.status(500).json({ error: 'Database query error', details: error.message });
    }
  } 
}

module.exports = new TradeController;
