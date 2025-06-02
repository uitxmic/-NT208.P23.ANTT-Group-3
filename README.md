# VoucherHub – Website mua bán trao đổi Voucher

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fwww.voucherhub.id.vn)](https://www.voucherhub.id.vn)
[![GitHub](https://img.shields.io/badge/Frontend-ReactJS-blue)](#)
[![GitHub](https://img.shields.io/badge/Backend-NodeJS-green)](#)
[![Database](https://img.shields.io/badge/Database-MySQL-orange)](#)

VoucherHub là nền tảng web cho phép người dùng **mua bán, trao đổi các loại voucher** một cách tiện lợi và minh bạch. Hệ thống hỗ trợ đăng bài bán voucher, duyệt giao dịch, hoàn tiền, và gợi ý voucher phù hợp theo nhu cầu người dùng.

Link truy cập website: [https://www.voucherhub.id.vn](https://www.voucherhub.id.vn)

---

## Sơ đồ kiến trúc tổng quan hệ thống
![SystemDesign (1)](https://github.com/user-attachments/assets/e826c799-a8ea-4989-b12b-09c6f519da9b)
- Kiến trúc hệ thống được chia làm 3 phần như sơ đồ trên:
  + Client Side (Phía Client) bao gồm ứng dụng website sử dụng thư viện ReactJS
  + Server Side (Phía Server) bao gồm hệ thống API được viết bằng NodeJS thông qua sử dụng ngôn ngữ Javascript, và MySQL.
  + Third Party Services (Các dịch vụ của bên thứ ba) gồm dịch vụ SMTP của Gmail (Google) và dịch vụ thanh toán của Momo.
- Truyền thông giữa các bên: 
  + Client – Server:  
     + Trao đổi dữ liệu giữa 2 bên diễn ra khi end user (người dùng cuối) tương tác với UI (User Interface) mà qua đó kích hoạt các lời gọi API được cung cấp bởi phía Server.
     + Sử dụng các phương thức HTTP POST và HTTP GET.  
  + Server – Third Party Services – Client:  
     + Diễn ra khi phía Server muốn gửi mail cho phía Client và ngược lại.
     + Sử dụng giao thức SMTP cho việc gửi và ở Client sử dụng POP3 hoặc IMAP cho việc nhận
  + Client – Third Party Services:
     + Diễn ra khi end user muốn sử dụng dịch vụ thanh toán được cung cấp bởi Momo Payment Gateway. Sử dụng phương thức HTTP GET.
  + Server – Third Party Services: 
     + Diễn ra khi server cần khởi tạo dịch vụ thanh toán cho client.
     + Sử dụng phương thức HTTP POST.

## Tính năng chính

- Đăng nhập/ Đăng ký:
  + Phân luồng người dùng: Admin, User
  + Quên mật khẩu
  + Đổi mật khẩu
- Đăng bài bán voucher: Người dùng có thể thêm và rao bán voucher của mình.
  + Thay đổi giá
  + Thay đổi hình
  + Xem trạng thái các bài đăng
- Mua voucher: Xem và mua các voucher đã được đăng bởi người khác.
  + Mua Voucher với tiền nạp vào hệ thống hoặc bằng Momo
  + Xác nhận giao dịch đã thành công.
- Yêu cầu hoàn tiền: Hỗ trợ gửi yêu cầu hoàn tiền trong các giao dịch.
- Lịch sử giao dịch: Theo dõi tất cả giao dịch đã thực hiện.
- Gợi ý thông minh: Gợi ý bài đăng phù hợp với người dùng dựa trên lịch sử hoặc sở thích.
- Tính năng dành cho Admin: Các chức năng dành cho người quản trị
  + Tính năng quản lý người dùng
  + Tính năng xem biểu đồ giao dịch
  + Tính năng kích hoạt bài đăng, vô hiệu hóa bài đăng
  + Tính năng Chấp nhận hoàn tiền, Từ chối hoàn tiền
---

## Công nghệ sử dụng

| Phần     | Công nghệ            |
|----------|----------------------|
| Frontend | ReactJS              |
| Backend  | Node.js              |
| Database | MySQL                |

---

## Cách cài đặt và chạy dự án

### Cấu trúc repo
Repo bao gồm hai phần chính:
client/ (Frontend - ReactJS)
server/ (Backend - NodeJS)

### Chạy frontend (ReactJS)
```bash
cd FrontEnd
npm install
npm run dev

```
Truy cập tại: http://localhost:5173
### Chạy BackEnd (NodeJS)
```bash
cd server
npm install
npm start
```
Backend chạy tại: http://localhost:3000
### 1. Cấu trúc cơ sở dữ liệu (Database Schema)
![Cấu trúc CSDL](./docs/database-schema.png)
### Luồng hoạt động chính

Dưới đây là các luồng chức năng chính trong hệ thống VoucherHub:

#### 1. Luồng Đăng ký / Đăng nhập
- Người dùng truy cập trang đăng ký hoặc đăng nhập.
- Gửi các thông tin đăng nhập (username, password), hoặc đăng ký (username, fullname, password, email, phonenumber)
- BackEnd gửi SQL Script về database thực thi
- Database gửi response về BackEnd.
- BackEnd tạo dựa vào ID hoặc UserId được database gửi về để tạo SessionId
- FrontEnd dựa vào SessionId này để tạo Cookies
![Luồng Đăng nhập](./docs/flows/ThreadLogin.png)
![Luồng Đăng ký](./docs/flows/ThreadSignUp.jpg)

### 2. Luồng đăng Voucher
- Client gửi các thông tin như Tên Voucher, Loại Voucher, Ngày Hết hạn, Mã Voucher về cho Server
- Server gọi API /voucher/addVoucher với các trường Authorization và application/json với các thông tin vừa nhận được
- Server gửi SQL Script về cho database thực hiện câu INSERT INTO
- Database gửi Response
- Server gửi Id xác nhận thành công
- Client cập nhật lại trang Voucher
![Luồng Thêm Voucher](./docs/flows/ThreadAddVoucher.jpg)

### 3. Luồng mua Voucher
 Luồng thanh toán bằng số dư tài khoản

  - Client gửi các thông tin như  cartItems (VoucherId, PostId, Amount, Quantity, UserIdSeller) về cho Server
  - Server gọi API /trade/createCartTransaction  với các trường Authorization và application/json với các thông tin vừa nhận được
  - Server xác thực session người dùng và kiểm tra cartItems là mảng không rỗng
  - Server chuyển cartItems thành JSON string và lấy UserIdBuyer từ session
  - Server gọi Stored Procedure fn_create_cart_transaction(cartData, UserIdBuyer)
  - Database gửi Response với Message và LastTransactionId hoặc error
  - Server gửi LastTransactionId  xác nhận thành công hoặc thông báo lỗi
  - Client cập nhật lại trang thanh toán

 Luồng thanh toán bằng MoMo

  - Client gửi các thông tin như  cartItems (VoucherId, PostId, Amount, Quantity, UserIdSeller) về cho Server
  - Server gọi API /payment/momo/create-payment-voucher với các trường Authorization và application/json với các thông tin vừa nhận được
  - erver xác thực cartData, userIdBuyer, kiểm tra thông tin voucher/post (số lượng, giá) và tính totalAmount. Tạo extraData chứa cartData và userIdBuyer.
  - Gọi MomoPaymentController để tạo requestBody MoMo với totalAmount, orderInfo, extraData và gửi yêu cầu đến MoMo API. Server trả về payUrl từ MoMo cho Client.
  - MoMo xử lý giao dịch.
  - Redirect: Chuyển hướng trình duyệt người dùng về /momo/redirect/voucher. Server xử lý và chuyển hướng Client về trang thông báo/hồ sơ.
  - IPN (quan trọng): Gửi thông báo POST không đồng bộ đến /momo/ipn. Server xác minh IPN, kiểm tra resultCode (thành công = 0).
  - Server gọi Stored Procedure fn_create_momo_cart_transaction(in_cart_data, in_UserIdBuyer)
  - Database gửi Response với Message và LastTransactionId hoặc error
  - Server gửi HTTP 204 No Content về MoMo để xác nhận đã xử lý IPN.
  - Cập nhật trạng thái trang (thông báo thành công/lỗi) và chuyển hướng người dùng dựa trên phản hồi redirect hoặc kết quả IPN.
![Luồng Thêm Voucher](./docs/flows/ThreadBuyVoucher.png)

### 4. Luồng đăng bài
Luồng Đăng bài

  - Người dùng sau khi đăng nhập, gửi POST request đến endpoint /posting/createPosting với dữ liệu bao gồm VoucherId, Postname, Content và JWT token trong header authorization PostingController.
  - Request được định tuyến qua BackEnd/routes/posting.js posting.js:12 , trước tiên phải qua middleware xác thực posting.js.
  - Phương thức CreatePosting của PostingController sẽ thực hiện 3 bước cơ bản:
    1. Kiểm tra Authorization: thông qua kiểm tra sự tồn tại JWT token và xác thực bằng cách giải mã token để lấy UserId trong PostingController.js    
    2. Validation data: Kiểm tra các trường bắt buộc gồm VoucherId, Postname, Content
    3. Gọi procedure fn_create_post thực thi với các tham số đã validate từ bước 2.
  - Procedure fn_create_post nhận các tham số đầu vào từ các trường từ middleware, sau đó thực hiện chức năng insert bài đăng mới vào bảng Post với ngày đăng là ngay thời điểm tạo, trạng thái mặc định là active, đồng thời trả về thông báo thành công kèm ID của post vừa tạo.
  - Controller trả kết quả từ procedure cho client hoặc thông báo lỗi nếu có exception.

Luồng thông báo (notification)

  - Trang notification được khởi tạo trong component Notification.jsx, sử dụng React hooks để quản lý trạng thái (state).
  - Khi component mount, useEffect tự động gọi hàm fetchNotifications để thực hiện GET request đến endpoint của notification: http://localhost:3000/notification .
  - Request được định tuyến qua hệ thống routing backend. Endpoint /notification được đăng ký trong main router index.js.
  - Trong notification router, route gốc / được map đến method Get20LastestNotifications trong notification.js.
  - NotificationController xử lý request thông qua method Get20LastestNotifications NotificationController.js:27-38 . Controller thực thi stored procedure fn_get_20_lastest_notifications() và trả về kết quả.
  - Sau khi nhận response thành công, frontend cập nhật state và render danh sách notification Notification.jsx:28-33 . Mỗi notification hiển thị title, content và timestamp.
### 5. Luồng yêu cầu hoàn tiền
-------- Khôi Lê ----------
![Luồng Yêu cầu hoàn tiền](./docs/flows/ThreadRequestRefund.jpg)




## Giao diện của các chức năng chính

Trang chủ
![image](https://github.com/user-attachments/assets/5831a657-59a7-4998-9795-ff0135d82bfe)

Đăng nhập
![image](https://github.com/user-attachments/assets/9a0292fa-b10d-4f06-9e28-26c332cc8fe8)

Yêu cầu quên mật khẩu:
![image](https://github.com/user-attachments/assets/f2e607cc-a4c0-4d82-a043-38c8f617052b)

Trang Quản lý bài đăng của User
![image](https://github.com/user-attachments/assets/6140fdbc-357c-4dca-851b-3f8bb72484aa)

Trang mua Voucher
![image](https://github.com/user-attachments/assets/d4be2c91-71fa-4e76-80ef-db517e8083fd)

Trang Quản lý mã giảm giá
![image](https://github.com/user-attachments/assets/a435c9f4-e3e2-48da-8df7-f08176160f88)

Trang thêm Voucher
![image](https://github.com/user-attachments/assets/f4370b23-02a0-4e9b-857f-9b40c46fca05)

Trang Quản lý các thông báo
![image](https://github.com/user-attachments/assets/99cd5ad2-29a5-4a2c-8f70-3015537ca1e3)

Trang Giỏ hàng
![image](https://github.com/user-attachments/assets/8f80ad7a-1132-4bbe-bb37-632d2cb11221)

Trang Lịch sử giao dịch
![image](https://github.com/user-attachments/assets/d2a06d04-c7d6-4338-9ba7-a79c2280cda0)

Trang Profile
![image](https://github.com/user-attachments/assets/911a8f22-c485-42c3-9184-08b8c3e4e62d)


Trang dành cho Admin
![image](https://github.com/user-attachments/assets/0e2c48c2-ab87-4f94-ba0f-35c1f3fde941)

Trang quản lý bài đăng cho Admin
![image](https://github.com/user-attachments/assets/8267fc7a-5db8-4b28-af9d-7fda1bdab177)

Trang quản lý người dùng dành cho Admin
![image](https://github.com/user-attachments/assets/8bb5ad20-4878-4ed1-8041-efed983efa63)

Trang quản lý giao dịch cho Admin
![image](https://github.com/user-attachments/assets/4c0b7e77-d2b3-4539-9803-a6c2aecd5276)

## Các phần cộng điểm
- Host lên được Internet:
  + Sử dụng VPS của Vietnix
  + Sử dụng domain từ iNET
  + Dùng nginx để host
![image](https://github.com/user-attachments/assets/4faf44a3-3db5-4343-bd25-a72e14aada73)
  + File cấu hình Nginx
![image](https://github.com/user-attachments/assets/819e9720-400f-4495-98a9-7ca8f105b7f8)

- Google PageSpeed
  + SEO Xanh
  + Tuy nhiên Performance chỉ 55, lý do trang Home đang có khá nhiều hiệu ứng (transition, gọi nhiều API, có hình ảnh mock-up ở LandingPage, ...)
![image](https://github.com/user-attachments/assets/96ae699b-9c22-4274-bfe2-c61f80756a2a)

- Video giới thiệu trang web:
  + Video trailer: https://www.tiktok.com/@dyff5hja2xeb/video/7510990677174455560
  + Video phỏng vấn: https://www.tiktok.com/@dyff5hja2xeb/video/7510989647057636615



## Kết luận

VoucherHub là nền tảng giao dịch voucher trực tuyến được phát triển với mục tiêu tạo ra một hệ sinh thái an toàn, minh bạch và thuận tiện cho người dùng trao đổi mã giảm giá. Với kiến trúc tách biệt Frontend (ReactJS) và Backend (NodeJS), cùng hệ quản trị cơ sở dữ liệu MySQL, hệ thống đảm bảo tính mở rộng, dễ bảo trì và hiệu suất cao.

Các tính năng cốt lõi như đăng bài, mua voucher, quản lý giao dịch, yêu cầu hoàn tiền và gợi ý thông minh giúp người dùng có trải nghiệm đầy đủ từ A-Z trong quy trình mua bán voucher.

---

## Hướng phát triển trong tương lai

Trong các giai đoạn tiếp theo, nhóm định hướng mở rộng hệ thống theo các hướng sau:

- **Tăng cường bảo mật:**
  - Áp dụng xác thực 2 lớp (2FA)
  - Mã hóa dữ liệu nhạy cảm và log hành vi người dùng đáng ngờ

- **Phát triển ứng dụng di động:**
  - Xây dựng ứng dụng di động sử dụng React Native để phục vụ người dùng trên cả iOS và Android

- **Ứng dụng AI và machine learning:**
  - Gợi ý bài đăng tốt hơn dựa trên lịch sử hành vi
  - Phân tích xu hướng mua bán voucher theo thời gian thực

- **Tích hợp cổng thanh toán đa dạng:**
  - Thêm các cổng thanh toán như ZaloPay, VNPAY,...

- **Tính năng chat giữa người mua và người bán:**
  - Tạo kênh liên lạc trực tiếp, tăng mức độ tin tưởng giữa hai bên

- **Trang quản trị nâng cao cho admin:**
  - Thống kê giao dịch, quản lý người dùng, kiểm duyệt bài đăng hiệu quả hơn

---

> Cảm ơn bạn đã quan tâm đến dự án VoucherHub! Mọi góp ý hoặc đóng góp đều được chào đón

## Bảng phân chia công việc

| Thành viên              | MSSV      | Công việc cụ thể                                                                                                    |
|------------------------|-----------|--------------------------------------------------------------------------------------------------------------------|
| **Lê Đăng Khôi**       | 23520766  | - Cấu hình frontend (ReactJS, Tailwind)
- Cấu hình session user
- Kết nối database
- Trang giỏ hàng
- Chức năng đánh giá post/người bán
- Redirect cho user chưa đăng nhập
- Tạo, quản lý dữ liệu voucher/post
- SEO
- Tái cấu trúc final project |
| **Nguyễn Trần Minh Khôi** | 23520780  | - Xây dựng MVC cho backend
- Tạo bảng quảng cáo, Navbar
- Trang đăng bài, danh sách voucher, tạo bài đăng
- Phân trang, chia bài đăng theo Category
- Call API Momo (nạp tiền, thanh toán)
- Trang Profile, chỉnh sửa hồ sơ
- Thêm voucher (form, Excel)
- Gợi ý bài đăng (Category, Transaction History, OpenAI)
- Tính năng Admin: quản lý bài đăng, người dùng, giao dịch |
| **Phạm Tấn Gia Quốc**  | 23521308  | - Thiết kế, tối ưu CSDL MySQL
- Tạo sơ đồ ERD
- Xử lý truy vấn SQL                                                                 |
| **Võ Minh Chiến**      | 23520184  | - Đăng nhập, đăng ký, quên mật khẩu
- Thanh toán bằng số dư tài khoản
- Thông báo, quản lý thông báo
- Trang chi tiết voucher, sử dụng mã
- Trang chi tiết bài đăng, trang người bán
- Thiết kế layout (navbar, sidebar, footer)
- Mục flashsale |
````

