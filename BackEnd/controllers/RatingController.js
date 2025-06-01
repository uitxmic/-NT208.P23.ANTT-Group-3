require('dotenv').config();
const { initConnection } = require('../middlewares/dbConnection');

class RatingController {
    constructor() {
        this.init();
    }

    async init() {
        this.connection = await initConnection();
    }

    // [Post] /rating/addRating
    AddRating = async (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Unauthorized: No session found' });
        }
        try {
            const { PostId, Vote, Rating, TransactionId, UserIdseller} = req.body;

            if (!PostId || !Rating) {
                return res.status(400).json({ message: "PostId and Rating are required" });
            }

            const [results] = await this.connection.query('CALL fn_rating(?, ?, ?, ?, ?)', [UserIdseller, PostId, Vote, Rating, TransactionId]);
            res.json(results[0]);
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

}

module.exports = new RatingController();