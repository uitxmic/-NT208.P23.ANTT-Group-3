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
    const { VoucherId, PostId, Amount, Quantity, UserIdSeller } = req.body;
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
      console.log('Quantity:', Quantity);
      console.log('UserIdSeller:', UserIdSeller);

      const [result] = await this.connection.query('CALL fn_create_transaction(?, ?, ?, ?, ?, ?)', [VoucherId, PostId, Amount, Quantity, UserIdBuyer, UserIdSeller]);
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

  CreateFreeTransaction = async (req, res) => {
    const { VoucherId, PostId, Amount, Quantity, UserIdSeller } = req.body;

    const token = req.headers['authorization'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!VoucherId || !PostId || !UserIdSeller) {
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
      console.log('Quantity:', Quantity);
      console.log('UserIdSeller:', UserIdSeller);

      const [result] = await this.connection.query(
        'CALL fn_create_free_transaction(?, ?, ?, ?, ?, ?, @out_message, @out_id)', [VoucherId, PostId, Amount, Quantity, UserIdBuyer, UserIdSeller]
      );

      const [[out]] = await this.connection.query('SELECT @out_message AS message, @out_id AS id');
      console.log('OUT:', out);

      if (out.message === 'Thu thập voucher thành công') {
        return res.status(200).json({ message: 'Success', transactionId: out.id });
      } else {
        return res.status(400).json({ error: out.message });
      }

    } catch (error) {
      console.error('Error creating transaction:', error);
      return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }

  CreateCartTransaction = async (req, res) => {
    const { cartItems } = req.body;
    const token = req.headers['authorization'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart items are required and must be a non-empty array' });
    }

    try {
      const secretKey = process.env.JWT_SECRET;
      const decode = jwt.verify(token, secretKey);
      const UserIdBuyer = decode.userId;

      console.log('UserIdBuyer:', UserIdBuyer);
      console.log('Cart Items:', cartItems);

      const cartData = JSON.stringify(cartItems);
      try {
        JSON.parse(cartData); // Kiểm tra JSON hợp lệ
      } catch (jsonError) {
        console.error('Invalid JSON:', jsonError);
        return res.status(400).json({ error: 'Invalid JSON format', details: jsonError.message });
      }

      console.log('cartData:', cartData);

      const [result] = await this.connection.query(
        'CALL fn_create_cart_transaction(?, ?)',
        [cartData, UserIdBuyer]
      );

      console.log('Result:', result);
      const message = result[0][0]?.Message;

      if (message === 'Cart Transaction Created') {
        return res.status(200).json({ message: 'Success', lastTransactionId: result[0][0]?.LastTransactionId });
      } else {
        return res.status(400).json({ error: message, transactionId: result[0][0]?.Id });
      }
    } catch (error) {
      console.error('Error creating cart transaction:', error);
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

    try {

      const [results] = await this.connection.query('CALL fn_complete_transaction(?)', [TransactionId]);
      const message = results[0][0]?.Message;
      const Id = results[0][0]?.Id;
      console.log('Id:', Id);
      console.log('Message:', message);
      if (Id !== -1)
        return res.status(200).json({ message: 'Success' });
      else
        return res.status(400).json({ error: message.error });
    } catch (error) {
      console.error('Query error:', error);
      res.status(500).json({ error: 'Database query error', details: error.message });
    }
  }

  // [PATCH] /trade/requestRefund
  RequestRefund = async (req, res) => {
    const { TransactionId } = req.body;
    if (!TransactionId) {
      return res.status(400).json({ error: 'TransactionId is required in request body' });
    }

    const token = req.headers['authorization'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {

      const [results] = await this.connection.query('CALL fn_request_refund(?)', [TransactionId]);
      const message = results[0][0]?.Message;
      const Id = results[0][0]?.Id;
      console.log('Id:', Id);
      console.log('Message:', message);
      if (Id !== -1)
        return res.status(200).json({ message: 'Success' });
      else
        return res.status(400).json({ error: message });
    } catch (error) {
      console.error('Query error:', error);
      res.status(500).json({ error: 'Database query error', details: error.message });
    }
  }

  // [PATCH] /trade/acceptRefund
  AcceptRefund = async (req, res) => {
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

      const [results] = await this.connection.query('CALL fn_accept_refund(?)', [TransactionId]);
      const message = results[0][0]?.Message;
      const Id = results[0][0]?.Id;
      console.log('Id:', Id);
      console.log('Message:', message);
      if (Id !== -1)
        return res.status(200).json({ message: 'Success' });
      else
        return res.status(400).json({ error: message });
    } catch (error) {
      console.error('Query error:', error);
      res.status(500).json({ error: 'Database query error', details: error.message });
    }
  }

  // [PATCH] /trade/rejectRefund
  RejectRefund = async (req, res) => {
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

      const [results] = await this.connection.query('CALL fn_reject_refund(?)', [TransactionId]);
      const message = results[0][0]?.Message;
      const Id = results[0][0]?.Id;
      console.log('Id:', Id);
      console.log('Message:', message);
      if (Id !== -1)
        return res.status(200).json({ message: 'Success' });
      else
        return res.status(400).json({ error: message });
    } catch (error) {
      console.error('Query error:', error);
      res.status(500).json({ error: 'Database query error', details: error.message });
    }
  }

  // [GET] /trade/getTransactionByUserId
  GetTransactionByUserId = async (req, res) => {
    const token = req.headers['authorization'];

    // Get query parameters for search and sorting
    const { search = '', sortColumn = 'CreateAt', sortOrder = 'DESC' } = req.query;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      var secretKey = process.env.JWT_SECRET;
      var decode = jwt.verify(token, secretKey);
      var UserId = decode.userId;

      const [results] = await this.connection.query('CALL fn_get_transaction_history_by_id(?, ?, ?, ?)', [UserId, search, sortColumn, sortOrder]);
      res.json(results[0]); // Chỉ trả về kết quả SELECT
    } catch (error) {
      console.error('Query error:', error);
      res.status(500).json({ error: 'Database query error', details: error.message });
    }
  }
}

module.exports = new TradeController;
