# VoucherHub - Nền tảng mua bán và trao đổi voucher trực tuyến

**Đề tài:** Website mua bán và chia sẻ voucher  
**Nhóm 3 - Lớp NT208.P23.ANTT**  

## **👨‍💻 Danh sách thành viên**
- **Lê Đăng Khôi** - MSSV: 23520766 - Nhóm trưởng  
- **Nguyễn Trần Minh Khôi** - MSSV: 23520780 - Thành viên  
- **Phạm Tấn Gia Quốc** - MSSV: 23521308 - Thành viên  
- **Võ Minh Chiến** - MSSV: 23520184 - Thành viên  
- **Đặng Trung Thành** - MSSV: 23521438 - Thành viên  

---

## **Giới thiệu**
**VoucherHub** là một nền tảng giúp người dùng **mua, bán và trao đổi voucher** một cách tiện lợi.  
- Tích hợp **tìm kiếm voucher**, **giao dịch trực tuyến**, và **đánh giá người bán**.  
- Hỗ trợ **nhiều danh mục voucher** từ các thương hiệu phổ biến.  

---

## **🛠 Công nghệ sử dụng**
### **Backend**
- **Node.js (Express.js)** - Xử lý API  
- **MySQL** - Lưu trữ dữ liệu  

### **Frontend**
- **React.js** - Xây dựng giao diện  
- **Tailwind CSS** - Thiết kế UI/UX  

---

## **Tính năng chính**
### **🔹 Chức năng cơ bản**
✅ Đăng tải và quản lý voucher, gift card  
✅ Tìm kiếm voucher theo danh mục  
✅ Đánh giá, phản hồi về người bán  

### **🔹 Chức năng mở rộng (Dự kiến phát triển)**
**Bảo mật giao dịch** (tích hợp blockchain)  
**AI gợi ý voucher** theo thói quen mua sắm  
**Tối ưu hiệu suất** để xử lý giao dịch nhanh hơn  

---

## **Cài đặt và chạy dự án**
### **Yêu cầu**
- **Node.js** >= 16.x  
- **MySQL** (đã khởi chạy)  
- **Git** (để clone repo)  

### **Bước 1: Clone dự án**
```
git clone https://github.com/your-repo/VoucherHub.git
cd VoucherHub
```
### **Bước 2: Cài đặt dependencies**
```
npm install
```
### **Bước 3: Cấu hình cơ sở dữ liệu**
- Tạo một database trong MySQL (vd: vouchersharing_db).
- Cập nhật các thông tin kết nối trong file *env.*:
```
  DB_HOST=localhost
  DB_USER=root
  DB_PASS=yourpassword
  DB_NAME=voucherhub_db
```
### **Bước 4: Chạy server backend**
```
   npm run server
```
### **Bước 5: Chạy frontend**
```
  cd client
  npm start
```
Lưu ý: Mở *http://localhost:3000* để truy cập website.
new thing f

---
## Liên hệ & Đóng góp
### Email: 23521308@gm.uit.edu.vn
### Github: https://github.com/Whats-up-pro
### Nếu có bất kỳ góp ý nào, vui lòng mở Issue hoặc Pull Request trên repo này.
