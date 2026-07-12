# 🛍️ Xuan Hai E-Commerce

A full-stack e-commerce web application built with **React + Vite** for the frontend and admin dashboard, and **Node.js + Express + MongoDB** for the backend. The application supports product management, shopping cart, order processing, and secure online payments via Stripe.

---

# 📁 Project Structure

```text
├── frontend/       # Customer-facing web application (React + Vite + Tailwind CSS)
├── admin/          # Admin dashboard (React + Vite + Tailwind CSS)
├── backend/        # REST API server (Node.js + Express + MongoDB)
└── README.md
```

---

# ✨ Features

## 🖥️ Admin Dashboard (`/admin`)

- Secure administrator authentication using JWT
- Add new products with up to 4 images uploaded to Cloudinary
- View and delete products
- Manage customer orders
- Update order delivery status

---

## 🌐 Customer Website (`/frontend`)

- Modern homepage with Hero Banner, Latest Collection, and Best Sellers
- Product collection with category filters, sorting, and search
- Real-time product search
- Product detail page with image gallery, size selection, and related products
- Shopping cart with quantity updates and item removal
- Checkout with complete shipping information
- Multiple payment methods:
  - Cash on Delivery (COD)
  - Stripe
- Automatic Stripe payment verification
- Order history and order tracking
- User registration and login
- About and Contact pages
- Newsletter subscription
- Fully responsive design
- Global state management using React Context API

---

## ⚙️ Backend API (`/backend`)

- User authentication (Register, Login, JWT)
- Product CRUD operations
- Cloudinary image upload
- Shopping cart management
- Order processing
- Payment integration:
  - Cash on Delivery
  - Stripe
  - Razorpay *(In Progress)*

---

# 🛠️ Tech Stack

| Layer | Technologies |
|--------|--------------|
| Frontend | React 19, Vite, Tailwind CSS, Context API |
| Admin Dashboard | React 19, Vite 7, Tailwind CSS 4 |
| Backend | Node.js, Express 5 |
| Database | MongoDB + Mongoose |
| Authentication | JWT, bcrypt |
| Image Storage | Cloudinary |
| Payment | Stripe, Razorpay |
| HTTP Client | Axios |
| Routing | React Router DOM v7 |
| Notifications | React Toastify |
| File Upload | Multer |
| Fonts | Google Fonts (Prata, Roboto, Outfit, Poppins) |

---

# 🚀 Getting Started

## Prerequisites

- Node.js 20+
- MongoDB Atlas or Local MongoDB
- Cloudinary Account
- Stripe Account (for online payments)

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

---

## 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder.

```env
# Server
PORT=4000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net

# Authentication
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret

# Admin Account
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

# Stripe
STRIPE_SECRET_KEY=sk_test_...
```

Start the backend server.

Development

```bash
npm run server
```

Production

```bash
npm start
```

Server URL

```
http://localhost:4000
```

---

## 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file.

```env
VITE_BACKEND_URL=http://localhost:4000
```

Run the development server.

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

## 4. Admin Dashboard Setup

```bash
cd admin
npm install
```

Create a `.env` file.

```env
VITE_BACKEND_URL=http://localhost:4000
```

Run the development server.

```bash
npm run dev
```

Admin URL

```
http://localhost:5174
```

---

# 📡 REST API

## Authentication

### User API (`/api/user`)

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/register` | Register a new account |
| POST | `/login` | User login |
| POST | `/admin` | Admin login |

---

## Product API (`/api/product`)

| Method | Endpoint | Authentication | Description |
|---------|----------|----------------|-------------|
| POST | `/add` | Admin | Create a product |
| GET | `/list` | Public | Get all products |
| POST | `/remove` | Admin | Delete a product |
| POST | `/single` | Public | Get product details |

---

## Cart API (`/api/cart`)

| Method | Endpoint | Authentication | Description |
|---------|----------|----------------|-------------|
| POST | `/add` | User | Add product to cart |
| POST | `/update` | User | Update cart |
| POST | `/get` | User | Retrieve cart |

---

## Order API (`/api/order`)

| Method | Endpoint | Authentication | Description |
|---------|----------|----------------|-------------|
| POST | `/place` | User | Place COD order |
| POST | `/stripe` | User | Place Stripe order |
| POST | `/userorders` | User | Get user's orders |
| POST | `/list` | Admin | Get all orders |
| POST | `/status` | Admin | Update order status |
| POST | `/verifyStripe` | User | Verify Stripe payment |

---

# 📦 Order Workflow

```text
Placed
   ↓
Packing
   ↓
Shipped
   ↓
Out for Delivery
   ↓
Delivered
```

---

# ☁️ Deployment

The project is ready for deployment on **Vercel**.

## Deploy Frontend

```bash
cd frontend
npm run build
vercel --prod
```

## Deploy Backend

```bash
cd backend
vercel --prod
```

## Deploy Admin Dashboard

```bash
cd admin
npm run build
vercel --prod
```

> After deploying the backend, remember to update `VITE_BACKEND_URL` in both the **Frontend** and **Admin** environment variables.

---

# 📂 Folder Structure

## Frontend

```text
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
└── vite.config.js
```

## Admin

```text
admin/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
└── vite.config.js
```

## Backend

```text
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
└── server.js
```

---

# 🗺️ Frontend Pages

| Route | Description |
|--------|-------------|
| `/` | Home |
| `/collection` | Product Collection |
| `/product/:id` | Product Details |
| `/cart` | Shopping Cart |
| `/place-order` | Checkout |
| `/orders` | Order History |
| `/verify` | Stripe Payment Verification |
| `/login` | Login / Register |
| `/about` | About Us |
| `/contact` | Contact |

---

# 📌 Notes

- Razorpay integration is currently under development.
- Configure CORS properly before deploying to production.
- Never commit `.env` files to the repository.
- Store all secrets securely using environment variables.

---

# 📄 License

This project is licensed under the **ISC License**.
