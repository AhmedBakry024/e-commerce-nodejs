# 🛒 E-Commerce Node.js API

A robust, fully-featured RESTful API for an E-Commerce platform built with **Node.js, Express, and MongoDB**. This project provides a complete backend solution with authentication, product management, shopping cart, order processing, and Stripe payment integration.

---

## ✨ Features

- **User Authentication & Authorization**: Secure signup, login, password management, and role-based access control (Admin vs. User) using **JWT** and **bcrypt**.
- **Product & Category Management**: Full CRUD operations for products and categories (Admin only).
- **Shopping Cart**: Manage cart items, update quantities, and calculate totals.
- **Order Processing**: Seamless checkout process.
- **Payment Integration**: Secure payment gateway integration using **Stripe**.
- **Reviews & Ratings**: Users can leave reviews and rate products.
- **Data Validation**: Strong input validation using **Joi** and **Validator**.
- **Email Services**: Automated emails for password resets and notifications using **Nodemailer**.
- **Error Handling**: Centralized and comprehensive error handling.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Authentication**: JSON Web Tokens (JWT)
- **Payment Gateway**: [Stripe API](https://stripe.com/)
- **Validation**: Joi
- **Mailer**: Nodemailer

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas URI)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AhmedBakry024/e-commerce-nodejs.git
   cd e-commerce-nodejs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add the necessary environment variables. Example:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=90d
   STRIPE_SECRET_KEY=your_stripe_secret_key
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The API will be running on `http://localhost:3000`.

---

## 📖 API Documentation

A fully configured **Postman Collection** is included in the repository to help you test and explore all available endpoints easily.

- Import the `E-Commerce Node.js API.postman_collection.json` file directly into your Postman workspace.

---

## 📂 Project Structure

```text
├── Controllers/       # Logic for handling API requests
├── Database/          # Database connection setup
├── Middlewares/       # Custom Express middlewares (Auth, Error handling, etc.)
├── Models/            # Mongoose database schemas
├── Routes/            # Express route definitions
├── Utils/             # Utility functions, error classes, and email services
├── public/            # Static files (if any)
├── server.js          # Entry point of the application
└── package.json       # Project metadata and dependencies
```

---
