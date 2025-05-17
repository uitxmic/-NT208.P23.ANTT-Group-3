const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class CartController {
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

            console.log('Connected to the database (async)');
        } catch (err) {
            console.error('Database connection error:', err);
        }
    }

    // [Get] /cart/getCart
    GetCart = async (req, res) => {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        try {
            const secretKey = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secretKey);
            const UserId = decoded.userId;

            const [results] = await this.connection.query('CALL fn_get_cart(?)', [UserId]);
            res.json(results[0]);
        }
        catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

    // [Post] /cart/addToCart
    AddToCart = async (req, res) => {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        try {
            const secretKey = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secretKey);
            const UserId = decoded.userId;

            const { PostId } = req.body;

            if (!PostId ) {
                return res.status(400).json({ message: "Bad Request: PostId and Quantity are required" });
            }

            await this.connection.query('CALL fn_add_to_cart(?, ?)', [UserId, PostId]);
            res.status(200).json({ message: "Product added to cart successfully" });
        }
        catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }

    // [Post] /cart/updateCart
    UpdateCart = async (req, res) => {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        
        try {
            const secretKey = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secretKey);
            const UserId = decoded.userId;

            const { ItemId, Quantity } = req.body;

            if (!ItemId || typeof Quantity === 'undefined' || Quantity === null) {
                return res.status(400).json({ message: "Bad Request: ItemId and Quantity are required" });
            }

            await this.connection.query('CALL fn_update_cart(?, ?, ?)', [UserId, ItemId, Quantity]);
            res.status(200).json({ message: "Cart updated successfully" });
        }
        catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ error: 'Database query error', details: error.message });
        }
    }
}

module.exports = new CartController();