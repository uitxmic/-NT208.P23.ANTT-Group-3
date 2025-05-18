const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const app = express();
const mysql = require('mysql2/promise');
require('dotenv').config();

class GoogleCloudController {
  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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

  GenerateAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
  }

  // [POST] /googlecloud/signInWithGoogle
  GoogleLogin = async (req, res) => {
    const { tokenId } = req.body;

    if (!tokenId) {
      return res.status(400).json({ error: 'Token ID is required' });
    }

    try {
      const ticket = await this.client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      const email = payload['email'];
      const name = payload['name'];


      const [rows] = await this.connection.query('CALL fn_get_user_by_email(?)', [email]);

      if (rows[0].length === 0) {
        console.log('User not found, creating new user...');
        const params = [
          name,         
          name,         
          "123",            
          email,        
          "0123456789",      
        ];
        console.log('SQL Parameters:', params); // Log tham số
        console.log("kekekkeke");
        await this.connection.query('CALL fn_create_user(?, ?, ?, ?, ?)', params);
      }
      
      const [userRows] = await this.connection.query('CALL fn_get_user_by_email(?)', [email]);
      const user = userRows[0][0];
      const userId = user.UserId;
      console.log('User ID:', userId);


      // Tạo access token và trả về cho client
      const accessToken = this.GenerateAccessToken({ userId, email });
      res.json({ state: 'success', access_token: accessToken });
    } catch (error) {
      console.error('Google login error:', error);
      res.status(500).json({ error: 'Google login error', details: error.message });
    }
  }

}

module.exports = new GoogleCloudController;