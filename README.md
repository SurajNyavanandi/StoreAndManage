# 🛍️ StoreAndManage - Complete E-Commerce Platform

A modern, startup-level e-commerce platform with React frontend and Node.js backend. Featuring Men's Wear, Women's Wear, and Kids Wear categories with a clean, responsive UI and robust backend API.

**Goal:** Startup-level UI + Job-ready project 🔥

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Frontend Setup](#frontend-setup)
4. [Backend Setup](#backend-setup)
5. [API Documentation](#api-documentation)
6. [Project Structure](#project-structure)
7. [Features](#features)
8. [Database Schema](#database-schema)
9. [Environment Variables](#environment-variables)

---

## 🎯 Project Overview

**StoreAndManage** is a full-stack e-commerce application designed to provide:
- **Simple yet professional UI** for browsing products
- **Robust backend** for product and user management
- **Authentication & Authorization** with JWT and role-based access
- **Email verification** using OTP
- **Category-based product filtering** (Kids, Mens, Womens)

---

## ⚙️ Tech Stack

### Frontend Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.4 | UI Framework |
| **Vite** | 8.0.4 | Build Tool & Dev Server |
| **Tailwind CSS** | v4.2.2 | Styling & Utilities |
| **React Router** | v7 | Navigation & Routing |
| **Axios** | Latest | HTTP Client |
| **Lucide React** | Icons | Icon Library |
| **React Carousel** | Carousel | Image Slideshow |

### Backend Technologies
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript Runtime |
| **Express.js** | Web Framework |
| **MongoDB** | NoSQL Database (Atlas) |
| **JWT** | Authentication Token |
| **bcryptjs** | Password Hashing |
| **Nodemailer** | Email Service (Gmail SMTP) |
| **CORS** | Cross-Origin Resource Sharing |

---

## 🚀 Frontend Setup

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation Steps

1. **Navigate to Frontend Directory**
```bash
cd frontend-store
npm install
```

2. **Environment Variables**
Create `.env` file in frontend-store root:
```env
VITE_API_URL=https://storeandmanage-backend.onrender.com
```

3. **Run Development Server**
```bash
npm run dev
```
Server runs on: `http://localhost:5173`

4. **Build for Production**
```bash
npm run build
```

### Frontend Project Structure

```
frontend-store/
├── src/
│   ├── components/
│   │   ├── App.jsx                 (Main App Component)
│   │   ├── Home.jsx                (Home Page)
│   │   ├── Header.jsx              (Navigation Header)
│   │   ├── Cards.jsx               (Category Cards)
│   │   ├── Popular.jsx             (Popular Products)
│   │   ├── ProductType.jsx         (Category Products Page)
│   │   ├── Cart.jsx                (Shopping Cart)
│   │   ├── Checkout.jsx            (Checkout Process)
│   │   ├── OrderSuccess.jsx        (Order Confirmation)
│   │   ├── HeroCarsouel.jsx        (Hero Image Carousel)
│   │   ├── Auth/
│   │   │   ├── Login.jsx           (Login Page)
│   │   │   ├── Register.jsx        (Registration Page)
│   │   │   ├── ForgotPassword.jsx  (Password Recovery)
│   │   │   └── Protectedroute.jsx  (Route Protection)
│   │   └── Reusable/
│   │       └── ProductGrid.jsx     (Reusable Product Grid)
│   ├── services/
│   │   └── AppContext.jsx          (Global State Management)
│   ├── data/
│   │   └── product.js              (Product Data)
│   ├── styles/
│   │   └── header.module.css       (Component Styles)
│   ├── images/                     (Static Images)
│   ├── main.jsx                    (Entry Point)
│   └── index.css                   (Global Styles)
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
└── package.json
```

### Frontend Tailwind Setup

**index.css**
```css
@import "tailwindcss";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
}

body {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

#root {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
```

**postcss.config.js**
```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
```

---

## 🔧 Backend Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Gmail account (for email verification)

### Installation Steps

1. **Navigate to Backend Directory**
```bash
cd Backend
npm install
```

2. **Setup Environment Variables**
Create `.env` file in Backend root:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/storeandmanage
JWT_SECRET=your_jwt_secret_key_here
PORT=3026
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
NODE_ENV=development
```

3. **Gmail App Password Setup**
   - Go to: https://myaccount.google.com/apppasswords
   - Select Device: Windows Computer
   - Select App: Mail
   - Generate 16-character password
   - Paste in `.env` as `EMAIL_PASSWORD`

4. **Start Backend Server**
```bash
npm run dev
```
Server runs on: `http://localhost:3026`

### Backend Project Structure

```
Backend/
├── config/
│   └── database.js                 (MongoDB Connection)
├── models/
│   ├── auth.js                     (User Schema)
│   ├── order.js                    (Order Schema)
│   └── product.js                  (Product Schema)
├── controllers/
│   ├── auth.js                     (Auth Logic)
│   ├── productController.js        (Product Logic)
│   └── order.js                    (Order Logic)
├── routes/
│   ├── auth.js                     (Auth Endpoints)
│   ├── products.js                 (Product Endpoints)
│   └── order.js                    (Order Endpoints)
├── middlewares/
│   ├── auth.js                     (JWT Verification)
│   └── authorize.js                (Role-based Access)
├── services/
│   └── email.js                    (Email Sending Logic)
├── utils/
│   └── otp.js                      (OTP Generation)
├── app.js                          (Express Server)
├── package.json
└── .env
```

---

## 📡 API Documentation

### Base URL
```
https://storeandmanage-backend.onrender.com
```
*Local Development:* `http://localhost:3026`

### CORS Configuration
Allowed Origins:
- `http://localhost:4200` (Angular)
- `http://localhost:5173` (Vite React)
- `https://virattom.com` (Production)
- `https://www.virattom.com` (Production)

### Health Check
```
GET /health
```
Response:
```json
{
  "status": "Server is healthy",
  "timestamp": "2026-04-15T10:30:00.000Z"
}
```

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/api/products` | Get all products | ❌ |
| GET | `/api/products?category=mens` | Filter by category | ❌ |
| GET | `/api/products/:id` | Get single product | ❌ |
| POST | `/api/products` | Create product | ✅ Admin |
| PUT | `/api/products/:id` | Update product | ✅ Admin |
| DELETE | `/api/products/:id` | Delete product | ✅ Admin |

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/verify-otp` | Verify OTP |
| POST | `/auth/resend-otp` | Resend OTP |

---

## 💾 Database Schema

### Product Schema
```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "description": "String (required)",
  "price": "Number (required)",
  "category": "String (enum: kids, mens, womens)",
  "subcategory": "String (shirt, tshirt, pants, kurti, saree, frock, kurta)",
  "image": "String (required)",
  "stock": "Number (default: 0)",
  "rating": "Number (0-5, default: 0)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### User Schema
```json
{
  "_id": "ObjectId",
  "email": "String (required, unique)",
  "password": "String (hashed, required)",
  "firstName": "String",
  "lastName": "String",
  "isVerified": "Boolean (default: false)",
  "otp": "String",
  "otpExpiry": "Date",
  "role": "String (user, admin, default: user)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Categories & Subcategories

**Mens**
- shirt, tshirt, pants, kurta

**Womens**
- kurti, saree, pants, shirt

**Kids**
- shirt, tshirt, pants, kurta, frock

---

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://storeandmanage-backend.onrender.com
```

### Backend (.env)
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/storeandmanage

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Server
PORT=3026
NODE_ENV=development

# Email
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

---

## ✅ Completed Features

### Frontend
- ✅ Project setup (Vite + React 19)
- ✅ Tailwind CSS v4 configuration
- ✅ Responsive Header component
- ✅ React Router setup with routes
- ✅ Home page with Hero carousel
- ✅ Category cards component
- ✅ Popular products sections
- ✅ Product filtering by category
- ✅ Global state management (AppContext)
- ✅ Authentication component structure
- ✅ Mobile-friendly responsive design

### Backend
- ✅ Express server setup
- ✅ MongoDB connection
- ✅ Product CRUD operations
- ✅ Category-based filtering
- ✅ User authentication (JWT)
- ✅ Email verification with OTP
- ✅ Password hashing (bcryptjs)
- ✅ Role-based authorization
- ✅ CORS configuration
- ✅ Request logging middleware

---

## ⏳ Pending Features

- Search functionality
- Product detail page
- Order management
- Payment integration
- User profile management
- Product reviews & ratings
- Wishlist feature
- Inventory management
- Admin dashboard
- Analytics

---

## 🚨 Common Issues & Solutions

### Frontend

**Issue:** Products not loading on page open
**Solution:** useEffect hook must be in AppContext provider with empty dependency array

**Issue:** Tailwind styles not applying
**Solution:** Ensure `@import "tailwindcss"` in index.css and postcss.config.js is configured

**Issue:** API calls failing
**Solution:** Check CORS configuration and verify backend URL in environment variables

### Backend

**Issue:** MongoDB connection fails
**Solution:** Verify MONGO_URI format and IP whitelist in MongoDB Atlas

**Issue:** Emails not sending
**Solution:** Ensure Gmail app password is correct and 2FA is enabled

**Issue:** JWT token errors
**Solution:** Verify JWT_SECRET matches and token format includes "Bearer" prefix

---

## 📦 Dependencies

### Frontend
```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-router-dom": "^7.0.0",
  "axios": "latest",
  "tailwindcss": "^4.2.2",
  "lucide-react": "latest",
  "react-carousel": "latest"
}
```

### Backend
```json
{
  "express": "^4.18.0",
  "mongoose": "^7.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "nodemailer": "^6.9.0",
  "dotenv": "^16.0.0",
  "cors": "^2.8.5"
}
```

---

## 🎨 UI/UX Highlights

- **Clean & Modern Design:** Minimalist interface with professional appearance
- **Responsive Layout:** Mobile-first approach, optimized for all screen sizes
- **Fast Performance:** Vite for rapid development and optimized builds
- **Accessibility:** Semantic HTML and keyboard navigation support
- **Brand Consistency:** Logo (stoReAndManage with R, A, M in blue)

---

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🔗 Useful Links

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com)
- [JWT Introduction](https://jwt.io)

---

## 📧 Support

For issues, questions, or suggestions, please create an issue in the repository or contact the development team.

**Happy Coding! 🚀**
