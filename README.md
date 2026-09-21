# 🌿 Spice Garden - Authentic Bangalore Food Ordering & Restaurant Management Platform

A modern, full-stack food delivery and restaurant operations management platform built for **Spice Garden**, Bangalore.

---

## 🏗️ Architecture Overview

The system is organized into three distinct applications:

1. **`frontend` (Customer Web App - Port 5173)**:
   - Built with React + Vite
   - Modern responsive UI with mobile-first optimizations
   - Dynamic food discovery, menu filters, Bangalore zone delivery banners, cart management, checkout, order tracking, and diner reviews.

2. **`admin` (Restaurant Operations Portal - Port 5174)**:
   - Built with React + Vite
   - Executive dashboard with mobile 2-column grid KPI cards
   - Live Kitchen Fulfillment Pipeline (Order Placed ➔ Preparing ➔ Out for Delivery ➔ Fulfilled)
   - Real-time diner customer directory (`/customers`) with CSV export and lifetime spend metrics
   - Menu catalog management and review moderation

3. **`backend` (REST API & Database Engine - Port 5000)**:
   - Built with Node.js, Express, and Mongoose
   - MongoDB Atlas Cloud Database integration
   - JWT-based authentication & role-based access control (`customer`, `admin`)
   - Automated seeder with 60 authentic Bangalore dishes and multi-category menus

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster account

### 2. Environment Setup

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=spicegarden_super_secret_jwt_key_2026_blr
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.zhlwvni.mongodb.net/spice_garden?appName=Cluster0
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install service dependencies
npm run install:all
```

### 4. Seed Database

```bash
npm run seed
```

### 5. Launch All Services Concurrently

```bash
npm run dev
```

- **Customer App**: `http://localhost:5173`
- **Admin Portal**: `http://localhost:5174`
- **Backend API**: `http://localhost:5000`

---

## 🔐 Default Admin Credentials

- **Email**: `admin@spicegarden.com`
- **Password**: `Admin@123`
