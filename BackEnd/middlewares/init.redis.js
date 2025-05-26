const session = require("express-session");

// Cấu hình session middleware để lưu vào RAM
let sessionMiddleware;

try {
    sessionMiddleware = session({
        secret: '5UP3r 53Cr37',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production', // Đặt thành true nếu dùng HTTPS
            httpOnly: true,
            maxAge: 1000 * 60 * 60, // 1 giờ
        },
    });
} catch (error) {
    console.error("Lỗi khi khởi tạo session middleware:", error);
    throw error; // Ném lỗi để xử lý ở cấp cao hơn nếu cần
}

module.exports = sessionMiddleware;