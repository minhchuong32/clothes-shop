# 🛍️ Xuân Hải E-Commerce

Dự án web thương mại điện tử full-stack xây dựng bằng **React + Vite** (frontend & admin) và **Node.js + Express + MongoDB** (backend). Hỗ trợ quản lý sản phẩm, đơn hàng, giỏ hàng và thanh toán qua Stripe.

---

## 📁 Cấu trúc dự án

```
├── frontend/       # Giao diện người dùng (React + Vite + Tailwind CSS)
├── admin/          # Trang quản trị (React + Vite + Tailwind CSS)
├── backend/        # API server (Node.js + Express + MongoDB)
└── README.md
```

---

## ✨ Tính năng

### 🖥️ Trang quản trị (`/admin`)
- Đăng nhập admin bảo mật bằng JWT
- Thêm sản phẩm mới kèm tối đa 4 ảnh (upload lên Cloudinary)
- Xem danh sách & xóa sản phẩm
- Quản lý đơn hàng và cập nhật trạng thái giao hàng

### 🌐 Giao diện người dùng (`/frontend`)
- Trang chủ với Hero banner, bộ sưu tập mới nhất & sản phẩm bán chạy
- Trang bộ sưu tập với bộ lọc theo danh mục, loại sản phẩm và sắp xếp theo giá
- Thanh tìm kiếm sản phẩm realtime
- Trang chi tiết sản phẩm: xem ảnh, chọn size, sản phẩm liên quan
- Giỏ hàng: thêm, cập nhật số lượng, xóa sản phẩm
- Đặt hàng với form địa chỉ giao hàng đầy đủ
- Thanh toán COD hoặc Stripe
- Xác minh thanh toán Stripe tự động (`/verify`)
- Trang lịch sử đơn hàng và theo dõi trạng thái
- Đăng ký / Đăng nhập tài khoản
- Trang Giới thiệu & Liên hệ
- Đăng ký nhận bản tin (newsletter)
- Responsive toàn bộ giao diện (mobile & desktop)
- Quản lý state toàn cục qua React Context API (`ShopContext`)

### ⚙️ Backend API (`/backend`)
- Xác thực người dùng (đăng ký, đăng nhập, JWT)
- CRUD sản phẩm với upload ảnh qua Cloudinary
- Quản lý giỏ hàng theo từng người dùng
- Đặt hàng với nhiều phương thức thanh toán:
  - COD (thanh toán khi nhận hàng)
  - Stripe
  - Razorpay *(đang phát triển)*

---

## 🛠️ Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Frontend người dùng | React 19, Vite, Tailwind CSS, Context API |
| Frontend Admin | React 19, Vite 7, Tailwind CSS 4 |
| Backend | Node.js, Express 5, MongoDB (Mongoose) |
| Xác thực | JWT (jsonwebtoken), bcrypt |
| Lưu trữ ảnh | Cloudinary |
| Thanh toán | Stripe, Razorpay |
| HTTP Client | Axios |
| Routing | React Router DOM v7 |
| Thông báo | React Toastify |
| Upload file | Multer |
| Font chữ | Google Fonts (Prata, Roboto, Outfit, Poppins) |

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- Node.js >= 20.x
- MongoDB Atlas hoặc MongoDB local
- Tài khoản [Cloudinary](https://cloudinary.com/)
- Tài khoản [Stripe](https://stripe.com/) *(nếu dùng thanh toán online)*

---

### 1. Clone dự án

```bash
git clone <repository-url>
cd <project-folder>
```

---

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend/`:

```env
# Server
PORT=4000

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

# Stripe
STRIPE_SECRET_KEY=sk_test_...
```

Chạy server:

```bash
# Development (với nodemon)
npm run server

# Production
npm start
```

Server chạy tại: `http://localhost:4000`

---

### 3. Cài đặt Frontend

```bash
cd frontend
npm install
```

Tạo file `.env` trong thư mục `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Chạy dev server:

```bash
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

---

### 4. Cài đặt Admin Panel

```bash
cd admin
npm install
```

Tạo file `.env` trong thư mục `admin/`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Chạy dev server:

```bash
npm run dev
```

Admin panel chạy tại: `http://localhost:5174`

---

## 📡 API Endpoints

### 👤 User (`/api/user`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/register` | Đăng ký tài khoản |
| POST | `/login` | Đăng nhập |
| POST | `/admin` | Đăng nhập admin |

### 📦 Product (`/api/product`)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/add` | Thêm sản phẩm | Admin |
| GET | `/list` | Lấy danh sách sản phẩm | — |
| POST | `/remove` | Xóa sản phẩm | — |
| POST | `/single` | Lấy chi tiết sản phẩm | — |

### 🛒 Cart (`/api/cart`)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/add` | Thêm vào giỏ hàng | User |
| POST | `/update` | Cập nhật giỏ hàng | User |
| POST | `/get` | Lấy giỏ hàng | User |

### 🧾 Order (`/api/order`)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/place` | Đặt hàng COD | User |
| POST | `/stripe` | Đặt hàng qua Stripe | User |
| POST | `/userorders` | Lấy đơn hàng của user | User |
| POST | `/list` | Lấy tất cả đơn hàng | Admin |
| POST | `/status` | Cập nhật trạng thái đơn | Admin |
| POST | `/verifyStripe` | Xác nhận thanh toán Stripe | User |

---

## 🗂️ Trạng thái đơn hàng

```
Đã đặt hàng → Đang đóng gói → Đã gửi hàng → Đang giao → Đã giao
```

---

## 🌐 Triển khai (Vercel)

Cả `admin` và `backend` đều có sẵn file `vercel.json` để deploy lên Vercel.

### Deploy Frontend
```bash
cd frontend
npm run build
vercel --prod
```

### Deploy Backend
```bash
cd backend
vercel --prod
```

### Deploy Admin
```bash
cd admin
npm run build
vercel --prod
```

> ⚠️ Sau khi deploy backend, cập nhật lại `VITE_BACKEND_URL` trong biến môi trường của cả **frontend** và **admin** trên Vercel dashboard.

---

## 📂 Cấu trúc thư mục chi tiết

```
frontend/
├── src/
│   ├── assets/         # Hình ảnh, icon, dữ liệu tĩnh
│   ├── components/     # Navbar, Footer, Hero, ProductItem, SearchBar...
│   ├── context/        # ShopContext (global state)
│   ├── pages/          # Home, Collection, Product, Cart, PlaceOrder, Orders...
│   ├── App.jsx
│   └── main.jsx
└── vite.config.js

admin/
├── src/
│   ├── assets/         # Hình ảnh, icon tĩnh
│   ├── components/     # Login, Navbar, Sidebar
│   ├── pages/          # Add.jsx, List.jsx, Order.jsx
│   ├── App.jsx
│   └── main.jsx
└── vite.config.js

backend/
├── config/             # Kết nối MongoDB & Cloudinary
├── controllers/        # Xử lý logic nghiệp vụ
├── middleware/         # Auth, AdminAuth, Multer
├── models/             # User, Product, Order schemas
├── routes/             # Định nghĩa API routes
└── server.js
```

---

## 🗺️ Các trang Frontend

| Đường dẫn | Trang | Mô tả |
|---|---|---|
| `/` | Home | Trang chủ, hero banner, bộ sưu tập & bán chạy |
| `/collection` | Collection | Danh sách sản phẩm, lọc & sắp xếp |
| `/product/:id` | Product | Chi tiết sản phẩm, chọn size, thêm giỏ hàng |
| `/cart` | Cart | Giỏ hàng, cập nhật số lượng |
| `/place-order` | PlaceOrder | Nhập địa chỉ & chọn phương thức thanh toán |
| `/orders` | Orders | Lịch sử đơn hàng |
| `/verify` | Verify | Xác minh thanh toán Stripe |
| `/login` | Login | Đăng nhập / Đăng ký |
| `/about` | About | Giới thiệu thương hiệu |
| `/contact` | Contact | Thông tin liên hệ |

---

## 📝 Ghi chú

- Tích hợp **Razorpay** hiện chưa hoàn thiện
- Đảm bảo cấu hình **CORS** phù hợp khi deploy production
- Không commit file `.env` lên repository

---

## 📄 License

ISC
