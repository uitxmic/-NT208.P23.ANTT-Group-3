const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
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
        const { VoucherId, Postname, Content, VouImg, Price, Quantity } = req.body;
        const token = req.headers['authorization'];

        if (!token)
        {
            return res.status(401).json({ error: 'Unauthorized' , id: '-1'});
        }

        if (!VoucherId || !Postname || !Content)
        {
            return res.status(400).json({ error: 'VoucherId, Postname, and Content are required in request body', id: '-1' });
        }

        try 
        {
            const secretKey = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secretKey);
            const UserId = decoded.userId;

            const [results] = await this.connection.query(`CALL fn_create_post(?, ?, ?, ?, ?, ?, ?)`, [VoucherId, UserId, Postname, Content, VouImg, Price, Quantity]);

            res.json(results[0]);

        } catch (err) {
            console.error('Error creating posting:', err);
            return res.status(500).json({ error: 'Error creating posting', id: '-1' });
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
            const RequestUserId = decoded.userId;

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

    // [GET] /posting/getAllPostings 
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

    // [PUT] /posting/updatePosting
    UpdatePosting = async (req, res) =>
    {
        const {PostId, VoucherId, Postname, Content } = req.body;

        if (!PostId || !Postname || !Content)
        {
            return res.status(400).json({ error: 'PostId, Postname, and Content are required in request body' });
        }

        try 
        {
            const [results] = await this.connection.query(`CALL fn_update_post(?, ?, ?, ?)`, [PostId, VoucherId, Postname, Content]);

            res.json(results[0]);

        } catch (err) {
            console.error('Error updating posting:', err);
            return res.status(500).json({ error: 'Error updating posting' });
        }
    }

    // [PUT] /posting/deactivePosting
    DeactivePosting = async (req, res) =>
    {
        const { PostId } = req.body;

        if (!PostId)
        {
            return res.status(400).json({ error: 'PostId is required in request body' });
        }

        try 
        {
            const [results] = await this.connection.query(`CALL fn_deactive_post(?)`, [PostId]);

            res.json(results[0]);

        } catch (err) {
            console.error('Error deactivating posting:', err);
            return res.status(500).json({ error: 'Error deactivating posting' });
        }
    }

    // [PUT] /posting/activePosting
    ActivePosting = async (req, res) =>
    {
        const { PostId } = req.body;

        if (!PostId)
        {
            return res.status(400).json({ error: 'PostId is required in request body' });
        }

        try 
        {
            const [results] = await this.connection.query(`CALL fn_active_post(?)`, [PostId]);

            res.json(results[0]);

        } catch (err) {
            console.error('Error activating posting:', err);
            return res.status(500).json({ error: 'Error activating posting' });
        }
    }

    // [GET] /posting/getActivePostings
    GetActivePostings = async (req, res) =>
    {
        try 
        {
            const [results] = await this.connection.query(`CALL fn_get_active_post()`);
            res.json(results[0]);

        } catch (err) {
            console.error('Error getting active postings:', err);
            return res.status(500).json({ error: 'Error getting active postings' });
        }
    }

    // [GET] /posting/getDeactivePostings
    GetDeactivePostings = async (req, res) =>
    {
        try 
        {
            const [results] = await this.connection.query(`CALL fn_get_deactive_post()`);
            res.json(results[0]);

        } catch (err) {
            console.error('Error getting deactive postings:', err);
            return res.status(500).json({ error: 'Error getting deactive postings' });
        }
    }

    // [GET] /posting/get20LastestPostings
    Get20LastestPostings = async (req, res) =>
    {
        try 
        {
            const [results] = await this.connection.query(`CALL fn_get_20_lastest_posts()`);
            res.json(results[0]);

        } catch (err) {
            console.error('Error getting 20 lastest postings:', err);
            return res.status(500).json({ error: 'Error getting 20 lastest postings' });
        }
    }


}

module.exports = new PostingController();