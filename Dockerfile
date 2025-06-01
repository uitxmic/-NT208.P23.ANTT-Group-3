# Sử dụng Node.js làm base image
FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package.json ./
COPY BackEnd/package.json ./BackEnd/

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 3000 để ứng dụng lắng nghe
EXPOSE 3000

# Lệnh khởi chạy ứng dụng
CMD ["node", "BackEnd/server.js"]