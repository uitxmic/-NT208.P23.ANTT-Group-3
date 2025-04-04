const mysql = require('mysql2/promise');
require('dotenv').config();

class SearchController {
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
        } catch (err) {
            console.error('Database connection error:', err);
        }
    }

    // [GET] /search/vouchers
    SearchVouchers = async (req, res) => {
        const { searchTerm, category, minPrice, maxPrice, sortBy, isVerified, minFeedback, minSold, expireInDays } = req.query;

        try {
            const [results] = await this.connection.query(
                'CALL fn_search_vouchers_with_filters(?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    searchTerm || '',
                    category || null,
                    minPrice || 0,
                    maxPrice || 999999,
                    sortBy || 'price_asc',
                    isVerified || null,
                    minFeedback || null,
                    minSold || null,
                    expireInDays || null
                ]
            );
            res.json(results[0]);
        } catch (error) {
            console.error('Error searching vouchers:', error);
            res.status(500).json({ error: 'Error searching vouchers' });
        }
    };

    // [GET] /search/posts
    SearchPosts = async (req, res) => {
        const { searchTerm, isVerified, minInteractions, minDaysPosted, maxDaysPosted, sortBy } = req.query;

        try {
            const [results] = await this.connection.query(
                'CALL fn_search_posts_with_filters(?, ?, ?, ?, ?, ?)',
                [
                    searchTerm || '',
                    isVerified || null,
                    minInteractions || null,
                    minDaysPosted || null,
                    maxDaysPosted || null,
                    sortBy || 'date_desc'
                ]
            );
            res.json(results[0]);
        } catch (error) {
            console.error('Error searching posts:', error);
            res.status(500).json({ error: 'Error searching posts' });
        }
    };
}

module.exports = new SearchController();