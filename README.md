# 🌾 RIFY — Rural Real-Time Delivery Marketplace

> A full-stack real-time system connecting farmers, customers, and delivery drivers in one seamless delivery flow.

---

## 🚀 Overview

**RIFY** is a smart rural marketplace that enables the buying and selling of fresh rural products with **real-time delivery tracking** and live GPS updates.

The system connects **3 main roles**:
- 👨‍🌾 Sellers
- 🛒 Customers
- 🚚 Delivery Drivers

From product upload → order creation → driver assignment → live tracking → final delivery… everything runs in real-time.

---

## 🌐 Live Demo

👉 **Try it here:**  
https://your-live-demo-link.vercel.app

---

## 📸 Screenshots

### 🏠 Home Page
![Home Page](./screenshots/home.png)

### 🛒 Customer Live Tracking
Real-time driver movement on map after order acceptance
![Tracking](./screenshots/tracking.png)

### 👨‍🌾 Seller Dashboard
Manage products (Add / Edit / Delete)
![Seller Dashboard](./screenshots/seller.png)

### 🚚 Delivery Dashboard
Accept orders and handle real-time delivery flow
![Delivery Dashboard](./screenshots/delivery.png)

---

## ⚡ Key Features

### 🔄 Real-Time System
- Live order updates using Supabase Realtime
- Instant driver location updates on map

### 📍 GPS Tracking
- Live driver movement tracking
- Distance calculation between seller, driver, and customer

### 👨‍🌾 Seller System
- Add / Edit / Delete products
- Upload images and manage stock
- Location-based product data

### 🛒 Customer Experience
- Browse fresh rural products
- Place orders instantly
- Track delivery in real-time

### 🚚 Delivery System
- Receive orders after customer confirmation
- Accept / reject delivery requests
- Live navigation support

---

## 🧠 Core Logic

- Real-time events using Supabase
- Haversine Formula for distance calculation
- Multi-role architecture system
- Event-driven delivery flow

---

## 🛠️ Tech Stack

- Next.js (App Router)
- TypeScript
- Supabase (Auth + DB + Realtime + Storage)
- Tailwind CSS
- Google Maps API

---

## 🚀 Getting Started

To run this project locally:

```bash
git clone https://github.com/omar-sala/react-Rify.git
cd react-Rify
npm install
npm run dev
