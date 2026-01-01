

# Marketplace Admin Dashboard

A modern web application for managing vendors, stores, products, and orders. Built with **Next.js**, **TypeScript**, **React**, **Mongoose/MongoDB**, and **ShadCN UI** components.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Installation](#installation)
* [Usage](#usage)
* [API Endpoints](#api-endpoints)
* [License](#license)

---

## Features

* **User Roles:**

  * Customer
  * Vendor
  * Admin

* **Vendor/Store Management:**

  * Create and delete stores
  * Assign products to stores
  * Populate vendor information

* **Product Management:**

  * Add,  delete products
  * View product details per store

* **Order Management:**

  * Track orders per store
  * Toggle order payment status
  * Delete orders and associated order items

* **Dynamic Tables:**

  * Custom reusable table component (`CustomTable`)
  * Column configuration and custom rendering
  * Delete action with loading state

* **Authentication:**

  * JWT-based authentication
  * Role-based access control (Admin, Vendor, Customer)

---

## Tech Stack

* **Frontend:** Next.js 13 (App Router), React, TypeScript
* **UI:** ShadCN UI, Tailwind CSS, Lucide Icons
* **Backend:** Next.js API Routes, Node.js
* **Database:** MongoDB with Mongoose
* **State Management:** React `useState`, `useEffect`
* **Other:** REST API, JWT Authentication

---

## Project Structure

```
src/
├─ app/
│  ├─ (auth)/           # Login/Signup pages
│  ├─ admin/            # Admin dashboard pages
│  ├─ vendor/           # Vendor-specific pages
│  └─ api/              # Next.js API routes
│     ├─ order/         # Order endpoints (GET, PATCH, DELETE)
│     ├─ store/         # Store endpoints
│     ├─ product/       # Product endpoints
│     └─ auth/          # Authentication endpoints
├─ components/
│  ├─ ui/               # ShadCN-based UI components (Table, Button, Badge)
│  └─ common/           # Reusable components (CustomTable)
├─ models/              # Mongoose schemas (Store, Product, Order, User)
├─ actions/             # Fetching/updating data functions
└─ lib/                 # Utility functions (DB connection, getUserFromCookie)
```

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/marketplace-dashboard.git
cd marketplace-dashboard
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set environment variables:

```env
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Usage

* **Admin Dashboard:**

  * View all stores, products, and orders
  * Delete stores and automatically remove their products
  * Manage order payment status and delete orders

* **Vendor Dashboard:**

  * View own store and products
  * Add/edit/delete products
  * Track orders for your store

* **Custom Table Component:**

  * Reusable table component (`CustomTable`) for displaying any type of data
  * Supports column rendering, delete actions, and dynamic keys

---

## API Endpoints

| Method | Endpoint            | Description                                       |
| ------ | ------------------- | ------------------------------------------------- |
| GET    | /api/store          | Fetch store(s) (populates products & vendor info) |
| DELETE | /api/store/:id      | Delete a store and associated products            |
| GET    | /api/product        | Fetch all products                                |
| DELETE | /api/product/:id    | Delete a product                                  |
| GET    | /api/order/:orderId | Fetch a single order                              |
| PATCH  | /api/order/:orderId | Update order payment status                       |
| DELETE | /api/order/:orderId | Delete an order and its order items               |


