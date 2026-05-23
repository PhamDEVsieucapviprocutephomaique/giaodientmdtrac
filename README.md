# MarketPlacePro - Frontend Mobile

## Yêu cầu
- Node.js (18+)
- Expo Go trên điện thoại
- Backend đã chạy (xem hướng dẫn backend)

## Cài đặt

### 1. Clone project
```bash
git clone https://github.com/PhamDEVsieucapviprocutephomaique/giaodientmdtrac.git
2. Vào thư mục

cd giaodientmdtrac

3. Cài dependencies

npm install

4. Cấu hình IP backend

Mở file src/api/axiosClient.js, sửa dòng:

javascript
baseURL: "http://192.168.1.19:8080",
⚠️ Thay 192.168.1.19 bằng IP máy tính chạy backend

5. Tải Expo Go
Tải app Expo Go trên điện thoại (phiên bản mới nhất)

6. Chạy app
bash
npx expo start
7. Kết nối
Mở Expo Go trên điện thoại

Quét mã QR hiện trên terminal hoặc trình duyệt

Chờ load xong

8. Lưu ý
📱 Máy tính và điện thoại phải chung 1 mạng WiFi

⚠️ Quan trọng
Chạy backend trước khi chạy app

Phải tự thêm data trong database (lỗi do backend không viết các API cần thiết, không liên quan FE)



