# 🎟️ VoucherHub – Website mua bán trao đổi Voucher

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fwww.voucherhub.id.vn)](https://www.voucherhub.id.vn)
[![GitHub](https://img.shields.io/badge/Frontend-ReactJS-blue)](#)
[![GitHub](https://img.shields.io/badge/Backend-NodeJS-green)](#)
[![Database](https://img.shields.io/badge/Database-MySQL-orange)](#)

VoucherHub là nền tảng web cho phép người dùng **mua bán, trao đổi các loại voucher** một cách tiện lợi và minh bạch. Hệ thống hỗ trợ đăng bài bán voucher, duyệt giao dịch, hoàn tiền, và gợi ý voucher phù hợp theo nhu cầu người dùng.

🔗 Website chạy tại: [https://www.voucherhub.id.vn](https://www.voucherhub.id.vn)

---

## 🚀 Tính năng chính

- 📤 Đăng bài bán voucher: Người dùng có thể thêm và rao bán voucher của mình.
- 📥 Mua voucher: Xem và mua các voucher đã được đăng bởi người khác.
- 🔁 Yêu cầu hoàn tiền: Hỗ trợ gửi yêu cầu hoàn tiền trong các giao dịch.
- 📜 Lịch sử giao dịch: Theo dõi tất cả giao dịch đã thực hiện.
- 💡 Gợi ý thông minh: Gợi ý bài đăng phù hợp với người dùng dựa trên lịch sử hoặc sở thích.

---

## 🛠️ Công nghệ sử dụng

| Phần     | Công nghệ            |
|----------|----------------------|
| Frontend | ReactJS              |
| Backend  | Node.js              |
| Database | MySQL                |

---

## ⚙️ Cách cài đặt và chạy dự án

### 📁 Cấu trúc repo
Repo bao gồm hai phần chính:
client/ (Frontend - ReactJS)
server/ (Backend - NodeJS)

### 🖥️ Chạy frontend (ReactJS)
```bash
cd FrontEnd
npm install
npm run dev

```
Truy cập tại: http://localhost:5173
### 🖥️ Chạy BackEnd (NodeJS)
```bash
cd server
npm install
npm start
```
Backend chạy tại: http://localhost:3000
### 1. 🗂️ Cấu trúc cơ sở dữ liệu (Database Schema)
![Cấu trúc CSDL](./docs/database-schema.png)
### 🔄 Luồng hoạt động chính
![Luồng hoạt động](./docs/flow-diagram.png)
### 🖥️ Giao diện trang chủ
![Giao diện trang chủ](./docs/screenshots/homepage.png)
