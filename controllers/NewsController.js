const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class NewsController{
    constructor(){
        this.initConnection();
    }

    async initConnection(){
        try{
           this.connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
           });

           console.log('Connected to the database (async)');
        } catch(err){
            console.error('Database connecting error:', err);
        }
    }

    // [GET] /news
    GetAllNews = async (req, res) => {
        try {
            const [results] = await this.connection.query('CALL fn_get_all_post()');
            res.json(results[0]);
        } catch (error) {
            console.error('Error getting all news:', error);
            res.status(500).json({ error: 'Error getting all news' });
        }
    }

    // [GET] /news/:PostId
    GetNewsById = async (req, res) => {
        const { PostId } = req.params;

        if (!PostId) {
            return res.status(400).json({ error: 'PostId is required in request params' });
        }

        try {
            const [results] = await this.connection.query('CALL fn_show_post_info_by_id(?)', [PostId]);
            res.json(results[0]);
        } catch (error) {
            console.error('Error getting news by ID:', error);
            res.status(500).json({ error: 'Error getting news by ID' });
        }
    }

    // [POST] /news/create
    CreateNews = async (req, res) => {
        const { VoucherId, Postname, Content } = req.body;
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!VoucherId || !Postname || !Content) {
            return res.status(400).json({ error: 'VoucherId, Postname, and Content are required in request body' });
        }

        try {
            const secretKey = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secretKey);
            const UserId = decoded.UserId;

            const [results] = await this.connection.query('CALL fn_create_post(?, ?, ?, ?)', 
                [VoucherId, UserId, Postname, Content]);

            res.json(results[0]);
        } catch (error) {
            console.error('Error creating news:', error);
            res.status(500).json({ error: 'Error creating news' });
        }
    }

    // [PUT] /news/update
    UpdateNews = async (req, res) => {
        const { PostId, VoucherId, Postname, Content } = req.body;
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!PostId || !Postname || !Content) {
            return res.status(400).json({ error: 'PostId, Postname, and Content are required in request body' });
        }

        try {
            const [results] = await this.connection.query('CALL fn_update_post(?, ?, ?, ?)', 
                [PostId, VoucherId, Postname, Content]);

            res.json(results[0]);
        } catch (error) {
            console.error('Error updating news:', error);
            res.status(500).json({ error: 'Error updating news' });
        }
    }

    // [PUT] /news/deactivate
    DeactivateNews = async (req, res) => {
        const { PostId } = req.body;
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!PostId) {
            return res.status(400).json({ error: 'PostId is required in request body' });
        }

        try {
            const [results] = await this.connection.query('CALL fn_deactive_post(?)', [PostId]);
            res.json(results[0]);
        } catch (error) {
            console.error('Error deactivating news:', error);
            res.status(500).json({ error: 'Error deactivating news' });
        }
    }

    // [PUT] /news/activate
    ActivateNews = async (req, res) => {
        const { PostId } = req.body;
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!PostId) {
            return res.status(400).json({ error: 'PostId is required in request body' });
        }

        try {
            const [results] = await this.connection.query('CALL fn_active_post(?)', [PostId]);
            res.json(results[0]);
        } catch (error) {
            console.error('Error activating news:', error);
            res.status(500).json({ error: 'Error activating news' });
        }
    }
}

module.exports = new NewsController();