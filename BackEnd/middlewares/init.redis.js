const session = require("express-session");
const { createClient } = require("redis"); // Import createClient từ redis
const { RedisStore } = require("connect-redis"); // Import RedisStore từ connect-redis

// Tạo Redis client
const redisClient = createClient({
    url: "redis://localhost:6380", // Đảm bảo URL đúng với cấu hình Redis của bạn
    legacyMode: true, // Bật chế độ legacy nếu cần hỗ trợ các lệnh cũ
});

// Kết nối Redis và xử lý lỗi nếu có
redisClient.connect().catch((err) => {
    console.error("Không thể kết nối Redis:", err);
});

// Cấu hình session middleware
const sessionMiddleware = session({

    store: new RedisStore({ client: redisClient }), // Khởi tạo RedisStore với Redis client
    secret: '5UP3r 53Cr37', // Secret từ file .env hoặc hardcoded
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Đặt thành true nếu dùng HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60, // 1 giờ
    },
});

module.exports = sessionMiddleware;