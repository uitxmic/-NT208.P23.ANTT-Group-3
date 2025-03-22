const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
require('dotenv').config();

class PostingController
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

        } catch (err) {
            console.error('Database connection error:', err);
        }
    }

    // [POST] /posting/createPosting
    CreatePosting = async (req, res) =>
    {
        const { VoucherId, Postname, Content } = req.body;
        const token = req.headers['authorization'];

        if (!token)
        {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!VoucherId || !Postname || !Content)
        {
            return res.status(400).json({ error: 'VoucherId, Postname, and Content are required in request body' });
        }

        try 
        {
            const secretKey = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secretKey);
            const UserId = decoded.UserId;

            const [results] = await this.connection.query(`CALL fn_create_post(?, ?, ?, ?)`, [VoucherId, UserId, Postname, Content]);

            res.json(results[0]);

        } catch (err) {
            console.error('Error creating posting:', err);
            return res.status(500).json({ error: 'Error creating posting' });
        }
    }

    // [GET] /posting/getPostingsByUserId/:UserId
    GetPostingsByUserId = async (req, res) =>
    {
        const { UserId } = req.params;
        const token = req.headers['authorization'];

        if (!UserId)
        {
            return res.status(400).json({ error: 'UserId is required in request params' });
        }

        try 
        {
            const secretKey = process.env.JWT_SECRET;   
            const decoded = jwt.verify(token, secretKey);
            const RequestUserId = decoded.UserId;

            console.log('RequestUserId:', RequestUserId);
            console.log('UserId:', UserId);

            if (RequestUserId != UserId)
            {

                return res.status(403).json({ error: 'Unauthorized. Your UserId is not allowed' });
            }

            const [results] = await this.connection.query(`CALL fn_show_post_info_by_id(?)`, [UserId]);

            res.json(results[0]);

        } catch (err) {
            console.error('Error getting postings:', err);
            return res.status(500).json({ error: 'Error getting postings' });
        }
    }

    // [GET] /posting/getAllPostings without token
    GetAllPostings = async (req, res) =>
    {
        const token = req.headers['authorization'];

        if (!token)
        {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try 
        {
            const [results] = await this.connection.query(`CALL fn_get_all_post()`);

            res.json(results[0]);

        } catch (err) {
            console.error('Error getting postings:', err);
            return res.status(500).json({ error: 'Error getting postings' });
        }
    }

    // [GET] /posting/getPostingByPostId/:PostId
    GetPostingByPostId = async (req, res) =>
    {
        const { PostId } = req.params;
        const token = req.headers['authorization'];

        if (!PostId)
        {
            return res.status(400).json({ error: 'PostId is required in request params' });
        }

        try 
        {
            const [results] = await this.connection.query(`CALL fn_get_posting_by_post_id(?)`, [PostId]);

            res.json(results[0]);

        } catch (err) {
            console.error('Error getting posting:', err);
            return res.status(500).json({ error: 'Error getting posting' });
        }
    }
}

module.exports = new PostingController();