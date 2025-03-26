const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class UnifiedController {
    constructor() {
        this.initConnection();
    }

    async initConnection() {
        this.connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
    }

    /**
     * Xử lý unified search và filter cho bài đăng
     * @param {Object} params - Các tham số từ client
     * @param {boolean} [authRequired=true] - Yêu cầu xác thực
     */
    async unifiedPostSearch(params, authRequired = true) {
        const {
            keyword,
            categories = [],
            dateRange = {},
            status,
            userId,
            sort = { by: 'createdAt', order: 'DESC' },
            pagination = { page: 1, limit: 10 }
        } = params;

        // Xây dựng điều kiện
        let conditions = [];
        let queryParams = [];

        // Xử lý search
        if (keyword) {
            conditions.push(`(Postname LIKE ? OR Content LIKE ?)`);
            queryParams.push(`%${keyword}%`, `%${keyword}%`);
        }

        // Xử lý filter category
        if (categories.length > 0) {
            const placeholders = categories.map(() => '?').join(',');
            conditions.push(`Category IN (${placeholders})`);
            queryParams.push(...categories);
        }

        // Xử lý filter date range
        if (dateRange.start) {
            conditions.push(`CreatedAt >= ?`);
            queryParams.push(dateRange.start);
        }
        if (dateRange.end) {
            conditions.push(`CreatedAt <= ?`);
            queryParams.push(dateRange.end);
        }

        // Xử lý status
        if (status) {
            conditions.push(`IsActive = ?`);
            queryParams.push(status === 'active' ? 1 : 0);
        }

        // Xử lý user filter
        if (userId) {
            conditions.push(`UserId = ?`);
            queryParams.push(userId);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const offset = (pagination.page - 1) * pagination.limit;

        // Query chính
        const query = `
            SELECT * FROM Posts 
            ${whereClause}
            ORDER BY ${sort.by} ${sort.order}
            LIMIT ? OFFSET ?
        `;

        queryParams.push(pagination.limit, offset);

        // Query đếm tổng
        const countQuery = `SELECT COUNT(*) as total FROM Posts ${whereClause}`;

        const [results] = await this.connection.query(query, queryParams);
        const [countResult] = await this.connection.query(countQuery, queryParams.slice(0, -2));

        return {
            data: results,
            meta: {
                total: countResult[0].total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: Math.ceil(countResult[0].total / pagination.limit)
            }
        };
    }

    // API Endpoint
    async searchAndFilterPosts(req, res) {
        try {
            // Xác thực nếu cần
            if (req.headers['authorization']) {
                jwt.verify(req.headers['authorization'], process.env.JWT_SECRET);
            }

            const result = await this.unifiedPostSearch(req.query);
            res.json(result);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new UnifiedController();