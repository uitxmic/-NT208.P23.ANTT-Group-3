const mysql = require('mysql2/promise');
const { parse } = require('path');
const { start } = require('repl');
require('dotenv').config();

class SearchController {
    constructor() {
        this.initConnection();
    }

    async initConnection() {
        try {
            this.pool = await mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
            });
            // console[test] = await this.pool.query('SELECT 1');
            console.log('Database pool connection success.');
        } catch (err) {
            console.error('Database connection error:', err);
        }
    }

    // [GET] /search/vouchers
    SearchVouchers = async (req, res) => {
        const { searchTerm, category,min_price, max_price, sortBy, expiredDays } = req.query;

        try {
            const [results] = await this.pool.query(
                'CALL fn_search_vouchers_with_filters(?, ?, ?, ?, ?, ?)',
                [
                    searchTerm || '',
                    category || null,
                    min_price || 0,
                    max_price || 99999,
                    sortBy || 'price_asc',
                    expiredDays || null
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
        const { searchTerm, minInteractions, minDaysPosted, maxDaysPosted, sortBy, startDate, endDate } = req.query;

        try {
            const [results] = await this.pool.query(
                'CALL fn_search_posts_with_filters(?, ?, ?, ?, ?, ?)',
                [
                    searchTerm || '',
                    minDaysPosted || null,
                    maxDaysPosted || null,
                    sortBy || 'date_asc',
                    startDate || null,
                    endDate || null
                ]
            );
            res.json(results[0]);
        } catch (error) {
            console.error('Error searching posts:', error);
            res.status(500).json({ error: 'Error searching posts' });
        }
    };

    // // [GET] /search/users
    // SearchUsers = async (req, res) => {
    //     const { searchTerm, role_id } = req.query;
    
    //     try {
    //         const [results] = await this.pool.query(
    //             'CALL fn_search_users(?, ?)',
    //             [searchTerm || '', role_id]
    //         );
    //         res.json(results[0]);
    //     } catch (error) {
    //         console.error('Error searching users:', error);
    //         res.status(500).json({ error: 'Error searching users' });
    //     }
    // };

    // [GET] /search/users apply filters
    SearchUsers = async(req,res) =>{
        const{ searchTerm, minFeedback, minSold, sortBy} = req.query;
        
        const validSortOptions = ['feedback_asc', 'feedback_desc', 'sold_asc', 'sold_desc'];
        if (sortBy && !validSortOptions.includes(sortBy)) {
            return res.status(400).json({ error: 'Invalid sortBy value.' });
        }

        try{
            const[results] = await this.pool.query(
                'CALL fn_search_users_with_filters(?, ?, ?, ?)',
                [
                searchTerm || '', 
                minFeedback || null, 
                minSold || null, 
                sortBy || 'feedback_desc'
            ]
            );
            res.json(results[0]);
        } catch(error){
            console.error('Error searching users with filters:', error);
            res.status(500).json({ error: 'Error searching users with filters' });
        }
    }
}

module.exports = new SearchController();