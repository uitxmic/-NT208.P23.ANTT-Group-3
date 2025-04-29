const mysql = require('mysql2/promise');
const { start } = require('repl');
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
        const { searchTerm, minInteractions, minDaysPosted, maxDaysPosted, sortBy, startDate, endDate } = req.query;

        try {
            const [results] = await this.connection.query(
                'CALL fn_search_posts_with_filters(?, ?, ?, ?, ?, ?)',
                [
                    searchTerm || '',
                    minInteractions || '0',
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

    // [GET] /search/users
    SearchUsers = async (req, res) => {
        const { searchTerm, role_id } = req.query;
    
        try {
            const [results] = await this.connection.query(
                'CALL fn_search_users(?, ?)',
                [searchTerm || '', role_id]
            );
            res.json(results[0]);
        } catch (error) {
            console.error('Error searching users:', error);
            res.status(500).json({ error: 'Error searching users' });
        }
    };

    // [GET] /search/users apply filters
    SearchUsersWithFilters = async(req,res) =>{
        const{ searchTerm, minFeedback, minSold, sortBy} = req.query;
        
        const validSortOptions = ['feedback_asc', 'feedback_desc', 'sold_asc', 'sold_desc'];
        if (sortBy && !validSortOptions.includes(sortBy)) {
            return res.status(400).json({ error: 'Invalid sortBy value.' });
        }

        try{
            const[results] = await this.connection.query(
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