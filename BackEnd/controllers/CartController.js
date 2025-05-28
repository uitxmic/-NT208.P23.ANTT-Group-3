const { initConnection } = require('../middlewares/dbConnection');

class CartController {
    constructor() {
        this.init();
    }

    async init() {
        this.connection = await initConnection();
    }

    // [Get] /cart/getCart
    GetCart = async (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Unauthorized: No session found" });
        }

        try {
            const UserId = req.session.user.UserId;
            const [results] = await this.connection.query('CALL fn_get_cart(?)', [UserId]);
            res.json(results[0]);
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

    // [Post] /cart/addToCart
    AddToCart = async (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Unauthorized: No session found" });
        }

        try {
            const UserId = req.session.user.UserId;
            const { PostId } = req.body;

            if (!PostId) {
                return res.status(400).json({ message: "Bad Request: PostId is required" });
            }

            await this.connection.query('CALL fn_add_to_cart(?, ?)', [UserId, PostId]);
            res.status(200).json({ message: "Product added to cart successfully" });
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

    // [Post] /cart/updateCart
    UpdateCart = async (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Unauthorized: No session found" });
        }

        try {
            const UserId = req.session.user.UserId;
            const { ItemId, Quantity } = req.body;

            if (!ItemId || typeof Quantity === 'undefined' || Quantity === null) {
                return res.status(400).json({ message: "Bad Request: ItemId and Quantity are required" });
            }

            await this.connection.query('CALL fn_update_cart(?, ?, ?)', [UserId, ItemId, Quantity]);
            res.status(200).json({ message: "Cart updated successfully" });
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

    async UpdateCartTransaction(UserIdBuyer,  ItemId, Quantity) {
        try {
            if (!this.connection) {
                console.error('Database connection not initialized');
                throw new Error('Database connection not initialized');
            }

            const query = 'CALL fn_update_cart(?, ?, ?)';
            const [result] = await this.connection.query(query, [UserIdBuyer, ItemId, Quantity]);

            console.log(`Updated cart transaction for user ${UserIdBuyer}`);
            return { success: true, message: result[0]?.Message };
        } catch (error) {
            console.error('Error updating cart transaction:', error.message, error.stack);
            throw error;
        }
    }
}

module.exports = new CartController();