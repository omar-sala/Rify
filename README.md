# 🌾 RIFY — Rural Real-Time Delivery Marketplace

> A full-stack real-time marketplace connecting farmers, customers, and delivery drivers in one unified system.

---

## 🚀 Overview

**RIFY** is not just an e-commerce platform — it's a complete **real-time delivery ecosystem** built to connect rural fresh product sellers with customers and delivery drivers.

From the moment a seller uploads a product → to order placement → driver assignment → live GPS tracking → final delivery… everything happens in real time.

---

## ⚡ Key Features

### 👨‍🌾 Seller Dashboard
- Add, edit, and delete products
- Manage stock & pricing
- Upload product images
- Include contact & location details

### 🛒 Customer Experience
- Browse fresh rural products
- Place orders instantly
- Track delivery in real-time on map 📍
- See live driver movement after order acceptance

### 🚚 Delivery System
- Receive nearby orders instantly after customer confirmation
- Accept or reject delivery requests
- Live GPS tracking updates
- Distance calculation between seller, driver, and customer

---

## 🧠 Core System Logic

- 🔄 **Real-Time Updates** using Supabase Realtime
- 📍 **Live GPS Tracking** for driver movement
- 📏 **Haversine Formula** for accurate distance calculation
- ⚡ **Event-driven order flow** from creation → delivery
- 🧩 Multi-role architecture (Seller / Customer / Driver)

---

## 🛠️ Tech Stack

- Next.js (App Router)
- TypeScript
- Supabase (Database + Realtime + Auth + Storage)
- Tailwind CSS
- Google Maps API

---

## 📦 Installation

```bash
npm install
npm run dev
