# 🛒 Role-Based eCommerce Admin Dashboard

A secure, role-based admin panel for an eCommerce backend built with **AdminJS**, **Sequelize**, **PostgreSQL**, **Node.js**, and **Express**.

## 📋 Features

- **JWT Authentication** — Secure login with bcrypt password hashing and JWT session handling.
- **Role-Based Access Control (RBAC)** — Admins get full access; Regular users see restricted views.
- **AdminJS Integration** — Auto-generated admin UI with custom Dashboard and Settings pages.
- **6 Database Models** — User, Category, Product, Order, OrderItem, and Setting with proper associations.
- **Custom Dashboard** — Real-time system summary with total users, orders, products, and revenue.
- **Custom Settings Page** — Key-value configuration management for admins.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (v18+) |
| Framework | Express.js |
| ORM | Sequelize v6 |
| Database | PostgreSQL |
| Admin UI | AdminJS v7 |
| Auth | JWT + bcrypt |
| Session | connect-pg-simple |

## 🗂️ Project Structure

```
ecommerce-admin/
├── src/
│   ├── config/
│   │   └── database.js              # Sequelize connection
│   ├── models/
│   │   ├── index.js                 # Model registry & associations
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   └── Setting.js
│   ├── routes/
│   │   └── auth.routes.js           # /api/login endpoint
│   ├── adminjs/
│   │   ├── auth.handler.js          # AdminJS authentication logic
│   │   ├── resources/               # AdminJS resource configurations
│   │   │   ├── user.resource.js
│   │   │   ├── category.resource.js
│   │   │   ├── product.resource.js
│   │   │   ├── order.resource.js
│   │   │   ├── orderItem.resource.js
│   │   │   └── setting.resource.js
│   │   └── components/
│   │       ├── Dashboard.jsx        # Custom dashboard page
│   │       └── Settings.jsx         # Custom settings page
│   ├── utils/
│   │   ├── hash.utils.js            # bcrypt helpers
│   │   └── jwt.utils.js             # JWT helpers
│   └── app.js                       # Express + AdminJS entry point
├── seeders/
│   └── seed.js                      # Database seed script
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL installed and running

### Installation

```bash
# Clone the repository
git clone https://github.com/ThisangaD/ecommerce-admin.git
cd ecommerce-admin

# Install dependencies
npm install

# Create the database
psql -U postgres -c "CREATE DATABASE ecommerce_admin;"

# Configure environment variables
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Seed the database
npm run seed

# Start the development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with nodemon |
| `npm start` | Start production server |
| `npm run seed` | Seed the database with sample data |

## 🔐 Authentication

### API Login

```
POST /api/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| User | user@example.com | user123 |

## 🛡️ Role-Based Access Control

| Feature | Admin | Regular User |
|---------|:-----:|:------------:|
| View Users table | ✅ | ❌ |
| View Settings table | ✅ | ❌ |
| View Products | ✅ | ✅ (read-only) |
| View Categories | ✅ | ✅ (read-only) |
| View Orders | ✅ (all) | ✅ (own only) |
| Create/Edit/Delete | ✅ | ❌ |
| Full Dashboard | ✅ | Limited |

## 📊 Database Schema

### Model Relationships

- `User` **has many** `Order`
- `Order` **belongs to** `User`
- `Category` **has many** `Product`
- `Product` **belongs to** `Category`
- `Order` **has many** `OrderItem`
- `OrderItem` **belongs to** `Order`
- `OrderItem` **belongs to** `Product`

## 🌐 Environment Variables

```env
PORT=3000
NODE_ENV=development
DB_NAME=ecommerce_admin
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h
SESSION_SECRET=your-session-secret
```

## 📝 Git Branch Strategy

This project follows a clean commit history using **Conventional Commits**:

- `feat:` — New features
- `fix:` — Bug fixes
- `chore:` — Maintenance tasks
- `config:` — Configuration changes
- `style:` — Code style improvements

## 📄 License

ISC
