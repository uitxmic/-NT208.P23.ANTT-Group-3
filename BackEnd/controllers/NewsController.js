require('dotenv').config();
const { initConnection } = require('../middlewares/dbConnection');

class NewsController{
    constructor(){
        this.init();
    }

    async init(){
        this.connection = await initConnection();
    }

    // [GET] /news
    GetAllNews = async (req, res) => {
        try {
            const [results] = await this.pool.query('CALL fn_get_all_news()');
            res.json(results[0]);
        } catch (error) {
            console.error('Error getting all news:', error);
            res.status(500).json({ error: 'Error getting all news' });
        }
    }

    // [GET] /news/:PostId
    GetNewsById = async (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Unauthorized: No session found" });
        }

        try {
            const { newsId } = req.params;
            if (!newsId) {
                return res.status(400).json({ message: "Bad Request: newsId is required" });
            }

            const [results] = await this.pool.query('CALL fn_get_news_by_id(?)', [newsId]);
            res.json(results[0]);
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

    // [POST] /news/create
    CreateNews = async (req, res) => {
        const { VoucherId, Postname, Content } = req.body;
        
        // Tạm thời bỏ check token để test
        /*const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }*/

        if (!VoucherId || !Postname || !Content) {
            return res.status(400).json({ error: 'VoucherId, Postname, and Content are required in request body' });
        }

        try {
            // Hardcode UserId = 1 để test
            const UserId = 1;
            const [results] = await this.pool.query('CALL fn_create_news(?, ?, ?, ?)', 
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
            const [results] = await this.pool.query('CALL fn_update_news(?, ?, ?, ?)', 
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
            const [results] = await this.pool.query('CALL fn_deactivate_news(?)', [PostId]);
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
            const [results] = await this.pool.query('CALL fn_activate_news(?)', [PostId]);
            res.json(results[0]);
        } catch (error) {
            console.error('Error activating news:', error);
            res.status(500).json({ error: 'Error activating news' });
        }
    }
}

module.exports = new NewsController();