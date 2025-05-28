require('dotenv').config();
const { initConnection } = require('../middlewares/dbConnection');

class SearchController {
    constructor() {
        this.init();
    }

    async init() {
        this.connection = await initConnection();
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
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Unauthorized: No session found" });
        }

        try {
            const { query } = req.query;
            if (!query) {
                return res.status(400).json({ message: "Bad Request: query is required" });
            }

            const [results] = await this.pool.query('CALL fn_search_posts(?)', [query]);
            res.json(results[0]);
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
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