# 🛒 Role-Based eCommerce Admin Dashboard
### AdminJS · Sequelize · PostgreSQL · Node.js · Express

> **Assignment for:** Software Engineer Internship — Change8 Ltd.
> **Deadline:** April 25th, 11:59 PM
> **Deliverables:** GitHub Repository Link + Demo Video (under 5 minutes)

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [System Architecture](#3-system-architecture)
4. [Feature Breakdown](#4-feature-breakdown)
5. [Database Schema](#5-database-schema)
6. [Project Structure](#6-project-structure)
7. [Step-by-Step Implementation Guide](#7-step-by-step-implementation-guide)
   - [Step 1: Initialize the Project](#step-1-initialize-the-project)
   - [Step 2: Set Up PostgreSQL & Sequelize](#step-2-set-up-postgresql--sequelize)
   - [Step 3: Define Database Models](#step-3-define-database-models)
   - [Step 4: Implement Authentication](#step-4-implement-authentication)
   - [Step 5: Configure AdminJS](#step-5-configure-adminjs)
   - [Step 6: Role-Based Access Control (RBAC)](#step-6-role-based-access-control-rbac)
   - [Step 7: Custom Dashboard Page](#step-7-custom-dashboard-page)
   - [Step 8: Custom Settings Page](#step-8-custom-settings-page)
   - [Step 9: Seed the Database](#step-9-seed-the-database)
   - [Step 10: Git & Branch Strategy](#step-10-git--branch-strategy)
   - [Step 11: Bonus — Deployment](#step-11-bonus--deployment)
8. [API Reference](#8-api-reference)
9. [Environment Variables](#9-environment-variables)
10. [Code Quality Standards](#10-code-quality-standards)
11. [Testing Checklist](#11-testing-checklist)
12. [Demo Video Script](#12-demo-video-script)

---

## 1. Project Overview

This project is a **secure, role-based eCommerce Admin Dashboard** built using AdminJS (formerly AdminBro), Sequelize ORM, and PostgreSQL. It provides two distinct user experiences:

- **Admins** get full access — they can manage users, products, categories, orders, and system settings through a feature-rich dashboard.
- **Regular Users** get a restricted view — they can log in and see only their relevant data (personal info, recent orders), with sensitive resources like Users and Settings hidden entirely.

The system is secured using **JWT-based authentication** and **bcrypt password hashing**, ensuring professional-grade security practices throughout.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | Node.js (v18+) | JavaScript server environment |
| Framework | Express.js | HTTP server and routing |
| ORM | Sequelize v6 | Database abstraction layer |
| Database | PostgreSQL | Relational data store |
| Admin UI | AdminJS v7 | Auto-generated admin interface |
| Auth | JWT + bcrypt | Secure authentication & hashing |
| Env Config | dotenv | Environment variable management |
| Dev Tools | nodemon | Auto-reload during development |

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│          Browser → AdminJS UI / API Calls               │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP
┌────────────────────────▼────────────────────────────────┐
│                   EXPRESS SERVER                        │
│                                                         │
│   ┌─────────────┐   ┌──────────────┐  ┌─────────────┐  │
│   │ Auth Routes │   │ AdminJS Panel│  │  API Routes │  │
│   │ /api/login  │   │ /admin/*     │  │  /api/*     │  │
│   └──────┬──────┘   └──────┬───────┘  └──────┬──────┘  │
│          │                 │                  │         │
│   ┌──────▼─────────────────▼──────────────────▼──────┐  │
│   │              Middleware Layer                     │  │
│   │   JWT Verify │ Role Check │ AdminJS Auth Guard    │  │
│   └──────────────────────────┬────────────────────────┘  │
│                              │                          │
│   ┌──────────────────────────▼────────────────────────┐  │
│   │             Sequelize ORM                         │  │
│   │   Models: User, Product, Category,                │  │
│   │           Order, OrderItem, Setting               │  │
│   └──────────────────────────┬────────────────────────┘  │
└──────────────────────────────│──────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────┐
│                    PostgreSQL Database                   │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Feature Breakdown

### ✅ Authentication
- `POST /api/login` endpoint accepting `email` + `password`
- Passwords stored with `bcrypt` (salt rounds: 10)
- On success, returns a signed **JWT** (expires in 24h)
- AdminJS protected behind JWT verification middleware
- Session handled via `@adminjs/express` with cookie-based session

### ✅ Role-Based Access Control (RBAC)

| Feature | Admin | Regular User |
|---|---|---|
| View Users table | ✅ | ❌ |
| Edit/Delete Users | ✅ | ❌ |
| View Settings table | ✅ | ❌ |
| View Products | ✅ | ✅ (read-only) |
| View Categories | ✅ | ✅ (read-only) |
| View Orders | ✅ | ✅ (own orders) |
| Custom Admin Dashboard | ✅ Full Summary | Limited View |
| Create/Edit/Delete records | ✅ | ❌ |

### ✅ AdminJS Resources
- All 6 models registered with proper configuration
- Password field hidden in all views using `isVisible: false`
- Relational data displayed with `reference` field types
- Custom actions where appropriate

### ✅ Custom Pages
- **Admin Dashboard**: Total users, total orders, total revenue, recent orders table
- **Settings Page**: Key-value configuration viewer/editor for admins

---

## 5. Database Schema

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    users     │       │    products      │       │  categories  │
│──────────────│       │──────────────────│       │──────────────│
│ id (PK)      │       │ id (PK)          │       │ id (PK)      │
│ name         │       │ name             │◄──────│ name         │
│ email        │       │ description      │       │ description  │
│ password     │       │ price            │       │ createdAt    │
│ role         │       │ stock            │       │ updatedAt    │
│ createdAt    │       │ categoryId (FK)  │       └──────────────┘
│ updatedAt    │       │ createdAt        │
└──────┬───────┘       │ updatedAt        │
       │               └──────────────────┘
       │
       │        ┌──────────────┐       ┌──────────────────┐
       └───────►│    orders    │       │   order_items    │
                │──────────────│       │──────────────────│
                │ id (PK)      │◄──────│ id (PK)          │
                │ userId (FK)  │       │ orderId (FK)     │
                │ status       │       │ productId (FK)   │
                │ totalAmount  │       │ quantity         │
                │ createdAt    │       │ unitPrice        │
                │ updatedAt    │       │ createdAt        │
                └──────────────┘       │ updatedAt        │
                                       └──────────────────┘

┌──────────────┐
│   settings   │
│──────────────│
│ id (PK)      │
│ key          │
│ value        │
│ description  │
│ createdAt    │
│ updatedAt    │
└──────────────┘
```

### Model Relationships
- `User` **has many** `Order`
- `Order` **belongs to** `User`
- `Order` **has many** `OrderItem`
- `OrderItem` **belongs to** `Order`
- `OrderItem` **belongs to** `Product`
- `Product` **belongs to** `Category`
- `Category` **has many** `Product`

---

## 6. Project Structure

```
ecommerce-admin/
│
├── src/
│   ├── config/
│   │   ├── database.js          # Sequelize connection instance
│   │   └── adminjs.js           # AdminJS configuration & resource setup
│   │
│   ├── models/
│   │   ├── index.js             # Model registry & association setup
│   │   ├── User.js              # User model definition
│   │   ├── Category.js          # Category model definition
│   │   ├── Product.js           # Product model definition
│   │   ├── Order.js             # Order model definition
│   │   ├── OrderItem.js         # OrderItem model definition
│   │   └── Setting.js           # Setting model definition
│   │
│   ├── middlewares/
│   │   ├── authenticate.js      # JWT verification middleware
│   │   └── authorize.js         # Role-based authorization middleware
│   │
│   ├── routes/
│   │   └── auth.routes.js       # /api/login and related auth routes
│   │
│   ├── adminjs/
│   │   ├── resources/
│   │   │   ├── user.resource.js      # AdminJS User resource config
│   │   │   ├── product.resource.js   # AdminJS Product resource config
│   │   │   ├── category.resource.js  # AdminJS Category resource config
│   │   │   ├── order.resource.js     # AdminJS Order resource config
│   │   │   ├── orderItem.resource.js # AdminJS OrderItem resource config
│   │   │   └── setting.resource.js   # AdminJS Setting resource config
│   │   │
│   │   ├── components/
│   │   │   ├── Dashboard.jsx         # Custom Admin Dashboard component
│   │   │   └── Settings.jsx          # Custom Settings page component
│   │   │
│   │   └── auth.handler.js           # AdminJS authenticate/authorize handler
│   │
│   ├── utils/
│   │   ├── jwt.utils.js         # JWT sign/verify helpers
│   │   └── hash.utils.js        # bcrypt hash/compare helpers
│   │
│   └── app.js                   # Express app setup & AdminJS mount
│
├── seeders/
│   └── seed.js                  # Database seed script
│
├── .env                         # Environment variables (gitignored)
├── .env.example                 # Example env file (committed)
├── .gitignore
├── package.json
└── README.md
```

---

## 7. Step-by-Step Implementation Guide

---

### Step 1: Initialize the Project

```bash
# Create project directory
mkdir ecommerce-admin && cd ecommerce-admin

# Initialize npm
npm init -y

# Install production dependencies
npm install express adminjs @adminjs/express @adminjs/sequelize \
  sequelize pg pg-hstore bcryptjs jsonwebtoken dotenv express-session \
  express-formidable connect-pg-simple

# Install development dependencies
npm install --save-dev nodemon
```

**Update `package.json` scripts:**
```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "seed": "node seeders/seed.js"
  }
}
```

> **Note on ESM:** AdminJS v7 requires ES Modules. Add `"type": "module"` to `package.json` or use `.mjs` extensions. All `import`/`export` syntax should be used instead of `require`.

---

### Step 2: Set Up PostgreSQL & Sequelize

**Create the database:**
```sql
CREATE DATABASE ecommerce_admin;
```

**`src/config/database.js`**
```javascript
/**
 * @file database.js
 * @description Sequelize connection configuration using environment variables.
 * Exports a singleton Sequelize instance used across all models.
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Sequelize instance connected to PostgreSQL.
 * Connection parameters are read from environment variables for security.
 */
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;
```

---

### Step 3: Define Database Models

> All models follow the same pattern: clean class-based definition, typed fields, and associations defined in a central `index.js`. Below is a full example for each.

**`src/models/User.js`**
```javascript
/**
 * @file User.js
 * @description Sequelize model for the `users` table.
 * Represents both admin and regular user accounts.
 */

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    /**
     * Stored as a bcrypt hash. Never stored or returned in plaintext.
     * Hidden from all AdminJS views via resource configuration.
     */
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    /**
     * User role determines access level throughout the application.
     * 'admin'  → full AdminJS access, all resources visible.
     * 'user'   → restricted access, limited resource visibility.
     */
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
```

**`src/models/Category.js`**
```javascript
/**
 * @file Category.js
 * @description Sequelize model for the `categories` table.
 * Categories group related products together.
 */

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Category extends Model {}

Category.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
  }
);

export default Category;
```

**`src/models/Product.js`**
```javascript
/**
 * @file Product.js
 * @description Sequelize model for the `products` table.
 * Each product belongs to a Category.
 */

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Product extends Model {}

Product.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'categories', key: 'id' },
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
  }
);

export default Product;
```

**`src/models/Order.js`**
```javascript
/**
 * @file Order.js
 * @description Sequelize model for the `orders` table.
 * Represents a customer's purchase, linked to a User.
 */

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Order extends Model {}

Order.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
  }
);

export default Order;
```

**`src/models/OrderItem.js`**
```javascript
/**
 * @file OrderItem.js
 * @description Sequelize model for the `order_items` table.
 * Represents individual line items within an Order.
 */

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class OrderItem extends Model {}

OrderItem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'orders', key: 'id' },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'products', key: 'id' },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    /** Price at the time of purchase — stored separately to preserve history */
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    timestamps: true,
  }
);

export default OrderItem;
```

**`src/models/Setting.js`**
```javascript
/**
 * @file Setting.js
 * @description Sequelize model for the `settings` table.
 * Stores key-value application configuration. Accessible by admins only.
 */

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Setting extends Model {}

Setting.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    key: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    value: { type: DataTypes.TEXT, allowNull: true },
    description: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    sequelize,
    modelName: 'Setting',
    tableName: 'settings',
    timestamps: true,
  }
);

export default Setting;
```

**`src/models/index.js`** — Associations & Registry
```javascript
/**
 * @file index.js
 * @description Central model registry. Imports all models and defines
 * their Sequelize associations in one place to avoid circular dependencies.
 */

import User from './User.js';
import Category from './Category.js';
import Product from './Product.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Setting from './Setting.js';

// ─── Associations ────────────────────────────────────────────────────────────

/** A category can contain many products */
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

/** A user can place many orders */
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

/** An order contains many line items */
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

/** Each line item references a product */
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });

export { User, Category, Product, Order, OrderItem, Setting };
```

---

### Step 4: Implement Authentication

**`src/utils/hash.utils.js`**
```javascript
/**
 * @file hash.utils.js
 * @description Utility functions for bcrypt password hashing and verification.
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password using bcrypt.
 * @param {string} plainText - The raw password to hash.
 * @returns {Promise<string>} The bcrypt hash string.
 */
export const hashPassword = (plainText) => bcrypt.hash(plainText, SALT_ROUNDS);

/**
 * Compares a plaintext password against a stored bcrypt hash.
 * @param {string} plainText - The raw password attempt.
 * @param {string} hash - The stored bcrypt hash.
 * @returns {Promise<boolean>} True if the password matches.
 */
export const comparePassword = (plainText, hash) => bcrypt.compare(plainText, hash);
```

**`src/utils/jwt.utils.js`**
```javascript
/**
 * @file jwt.utils.js
 * @description Utility functions for signing and verifying JWT tokens.
 */

import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
const EXPIRY = process.env.JWT_EXPIRY || '24h';

/**
 * Signs a JWT token containing the given payload.
 * @param {object} payload - Data to encode (e.g., { id, email, role }).
 * @returns {string} Signed JWT string.
 */
export const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRY });

/**
 * Verifies and decodes a JWT token.
 * @param {string} token - The JWT string to verify.
 * @returns {object} Decoded payload if valid.
 * @throws {JsonWebTokenError} If the token is invalid or expired.
 */
export const verifyToken = (token) => jwt.verify(token, SECRET);
```

**`src/routes/auth.routes.js`**
```javascript
/**
 * @file auth.routes.js
 * @description Authentication routes for the REST API.
 * Provides login endpoint that returns a JWT on successful authentication.
 */

import { Router } from 'express';
import { User } from '../models/index.js';
import { comparePassword } from '../utils/hash.utils.js';
import { signToken } from '../utils/jwt.utils.js';

const router = Router();

/**
 * POST /api/login
 * Authenticates a user and returns a signed JWT token.
 *
 * @body {string} email    - User's email address
 * @body {string} password - User's plaintext password
 *
 * @returns {200} { token, user: { id, name, email, role } }
 * @returns {400} If email or password is missing
 * @returns {401} If credentials are invalid
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
```

---

### Step 5: Configure AdminJS

**`src/adminjs/auth.handler.js`**
```javascript
/**
 * @file auth.handler.js
 * @description AdminJS authentication handler.
 * Validates credentials and returns the user object for AdminJS session.
 * Returning null denies access to the admin panel.
 */

import { User } from '../models/index.js';
import { comparePassword } from '../utils/hash.utils.js';

/**
 * Called by AdminJS on every login attempt via the /admin/login form.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object|null>} User data object or null if unauthorized.
 */
export const adminAuthenticate = async ({ email, password }) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    const isValid = await comparePassword(password, user.password);
    if (!isValid) return null;

    // Return a plain object — AdminJS stores this in session
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('[AdminJS] Authentication error:', error);
    return null;
  }
};
```

**`src/adminjs/resources/user.resource.js`**
```javascript
/**
 * @file user.resource.js
 * @description AdminJS resource configuration for the User model.
 * - Hides the password field from all views.
 * - Restricts list/show/edit/delete to admin role only.
 */

import { User } from '../../models/index.js';

export const userResource = {
  resource: User,
  options: {
    navigation: { name: 'User Management', icon: 'User' },
    properties: {
      password: {
        isVisible: { list: false, edit: false, filter: false, show: false },
      },
      createdAt: { isVisible: { list: true, show: true, edit: false, filter: true } },
    },
    actions: {
      list:   { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
      show:   { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
      new:    { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
      edit:   { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
      delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
    },
  },
};
```

**Apply the same pattern** for `setting.resource.js` (admin-only), and make product/category/order resources **visible to all** but with **write actions restricted** to admins.

Example snippet for `product.resource.js`:
```javascript
actions: {
  list:   { isAccessible: () => true },
  show:   { isAccessible: () => true },
  new:    { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
  edit:   { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
  delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
},
```

---

### Step 6: Role-Based Access Control (RBAC)

The RBAC is handled at two levels:

**Level 1 — AdminJS Resource Config** (Steps above)
Use `isAccessible` and `isVisible` in each resource's `actions` config.

**Level 2 — AdminJS `canInvokeAction` hook**
In your AdminJS setup, pass the `currentAdmin` check:

```javascript
// In src/config/adminjs.js

import AdminJS from 'adminjs';
import { AdminJSSequelize } from '@adminjs/sequelize';
import { userResource } from '../adminjs/resources/user.resource.js';
// ... other resources

AdminJS.registerAdapter({ Database: AdminJSSequelize.Database, Resource: AdminJSSequelize.Resource });

export const adminJs = new AdminJS({
  resources: [
    userResource,
    categoryResource,
    productResource,
    orderResource,
    orderItemResource,
    settingResource,
  ],
  rootPath: '/admin',
  dashboard: {
    // Custom dashboard component (see Step 7)
    component: AdminJS.bundle('./components/Dashboard.jsx'),
  },
  branding: {
    companyName: 'eCommerce Admin',
    logo: false,
    favicon: '/favicon.ico',
  },
});
```

---

### Step 7: Custom Dashboard Page

**`src/adminjs/components/Dashboard.jsx`**
```jsx
/**
 * @file Dashboard.jsx
 * @description Custom AdminJS Dashboard component.
 * Admins see full system stats; regular users see a personal summary.
 */

import React, { useEffect, useState } from 'react';
import { useCurrentAdmin } from 'adminjs';
import { Box, H2, H5, Text, Illustration } from '@adminjs/design-system';

const StatCard = ({ label, value, color }) => (
  <Box
    border="default"
    padding="xl"
    style={{ borderRadius: '8px', borderLeft: `4px solid ${color}`, background: '#fff' }}
  >
    <Text size="sm" color="grey60">{label}</Text>
    <H2 style={{ color }}>{value}</H2>
  </Box>
);

const Dashboard = () => {
  const [currentAdmin] = useCurrentAdmin();
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0, products: 0 });

  const isAdmin = currentAdmin?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      })
        .then((r) => r.json())
        .then(setStats)
        .catch(console.error);
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Box padding="xl">
        <H2>Welcome, {currentAdmin?.name}!</H2>
        <Text>You are logged in as a regular user. Use the panel to view your orders.</Text>
      </Box>
    );
  }

  return (
    <Box padding="xl">
      <H2 marginBottom="lg">📊 Admin Dashboard</H2>
      <Box display="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <StatCard label="Total Users"    value={stats.users}    color="#4F46E5" />
        <StatCard label="Total Orders"   value={stats.orders}   color="#059669" />
        <StatCard label="Total Revenue"  value={`$${stats.revenue}`} color="#D97706" />
        <StatCard label="Total Products" value={stats.products} color="#DC2626" />
      </Box>
    </Box>
  );
};

export default Dashboard;
```

> Add a **`/api/admin/stats`** route that queries the DB for aggregate counts and is protected by admin-only middleware.

---

### Step 8: Custom Settings Page

For the Settings page, register it as a custom AdminJS page:

```javascript
// In your AdminJS config
pages: {
  settings_page: {
    name: 'Settings',
    icon: 'Settings',
    component: AdminJS.bundle('./components/Settings.jsx'),
    handler: async (request, response, context) => {
      // Only admins can access this page
      if (context.currentAdmin?.role !== 'admin') {
        return { redirectUrl: '/admin' };
      }
      return {};
    },
  },
},
```

The `Settings.jsx` component should fetch settings via an API route and allow key-value editing for admins.

---

### Step 9: Seed the Database

**`seeders/seed.js`**
```javascript
/**
 * @file seed.js
 * @description Database seeder that populates all tables with sample data.
 * Run with: npm run seed
 */

import sequelize from '../src/config/database.js';
import { hashPassword } from '../src/utils/hash.utils.js';
import { User, Category, Product, Order, OrderItem, Setting } from '../src/models/index.js';

const seed = async () => {
  await sequelize.sync({ force: true }); // WARNING: drops & recreates all tables

  // ── Users ──────────────────────────────────────────────────────────────────
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: await hashPassword('Admin@123'),
    role: 'admin',
  });

  const regularUser = await User.create({
    name: 'John Doe',
    email: 'john@example.com',
    password: await hashPassword('User@123'),
    role: 'user',
  });

  // ── Categories ─────────────────────────────────────────────────────────────
  const electronics = await Category.create({ name: 'Electronics', description: 'Gadgets and devices' });
  const clothing    = await Category.create({ name: 'Clothing',    description: 'Apparel and accessories' });

  // ── Products ───────────────────────────────────────────────────────────────
  const laptop = await Product.create({ name: 'Laptop Pro 15', price: 1299.99, stock: 50, categoryId: electronics.id });
  const tshirt = await Product.create({ name: 'Classic T-Shirt', price: 29.99, stock: 200, categoryId: clothing.id });

  // ── Orders & Items ─────────────────────────────────────────────────────────
  const order = await Order.create({ userId: regularUser.id, status: 'delivered', totalAmount: 1329.98 });
  await OrderItem.create({ orderId: order.id, productId: laptop.id, quantity: 1, unitPrice: 1299.99 });
  await OrderItem.create({ orderId: order.id, productId: tshirt.id, quantity: 1, unitPrice: 29.99 });

  // ── Settings ───────────────────────────────────────────────────────────────
  await Setting.bulkCreate([
    { key: 'site_name',        value: 'My eCommerce Store',  description: 'Display name of the website' },
    { key: 'currency',         value: 'USD',                 description: 'Default currency' },
    { key: 'tax_rate',         value: '0.08',                description: 'Sales tax rate (decimal)' },
    { key: 'maintenance_mode', value: 'false',               description: 'Put site in maintenance mode' },
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('   Admin:  admin@example.com / Admin@123');
  console.log('   User:   john@example.com  / User@123');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
```

---

### Step 10: Git & Branch Strategy

```bash
# Initialize repo
git init
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-admin.git

# Create .gitignore
echo "node_modules/\n.env\ndist/" > .gitignore
```

**Branch Workflow:**

```
main                  ← Production-ready, protected
├── develop           ← Integration branch
│   ├── feature/setup-project
│   ├── feature/database-models
│   ├── feature/authentication
│   ├── feature/adminjs-setup
│   ├── feature/rbac
│   ├── feature/dashboard
│   ├── feature/settings-page
│   └── feature/seeder
```

**Workflow for each feature:**
```bash
git checkout develop
git checkout -b feature/authentication
# ... do the work ...
git add .
git commit -m "feat: implement JWT authentication with bcrypt hashing"
git push origin feature/authentication
# Open a Pull Request → develop
# After review: merge
```

**Commit Message Convention** (Conventional Commits):
- `feat:` — New feature
- `fix:` — Bug fix
- `chore:` — Tooling / config
- `docs:` — Documentation
- `refactor:` — Code improvement without feature change

---

### Step 11: Bonus — Deployment

**Option A: Railway (Recommended — free tier available)**
1. Push your repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add a PostgreSQL plugin
4. Set all environment variables in the Railway dashboard
5. Done — Railway handles the rest

**Option B: Render**
1. Create a Web Service on [render.com](https://render.com)
2. Add a PostgreSQL database service
3. Set env vars and deploy

---

## 8. API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/login` | None | Returns JWT token on valid credentials |
| `GET` | `/api/admin/stats` | Admin JWT | Returns dashboard aggregate stats |
| `GET` | `/admin` | Session | AdminJS panel root |
| `GET` | `/admin/login` | None | AdminJS login page |

---

## 9. Environment Variables

**`.env.example`** (commit this — not `.env`)
```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_admin
DB_USER=postgres
DB_PASSWORD=your_password_here

# Authentication
JWT_SECRET=your_very_long_and_secure_random_secret_here
JWT_EXPIRY=24h

# AdminJS Session
SESSION_SECRET=another_long_secure_random_secret_here
```

---

## 10. Code Quality Standards

Follow these conventions throughout the project for a professional, internship-level codebase:

### General Principles
- **Single Responsibility** — each file/class/function does one thing
- **DRY** (Don't Repeat Yourself) — abstract repeated logic into utilities
- **Fail Fast** — validate inputs early, return errors immediately
- **Meaningful Names** — variables and functions should be self-documenting

### Comments & Documentation
- Every file gets a `@file` and `@description` JSDoc header
- Every function gets a JSDoc comment with `@param` and `@returns`
- Inline comments for non-obvious logic only (`// Why`, not `// What`)

### Security Checklist
- [ ] Passwords never logged or returned in API responses
- [ ] JWT secret loaded from environment, never hardcoded
- [ ] Input validation on all request bodies
- [ ] SQL injection prevented by Sequelize's parameterized queries
- [ ] Error messages don't leak internal stack traces in production
- [ ] `.env` in `.gitignore` — never committed

### Folder & File Naming
- `camelCase` for files and functions
- `PascalCase` for classes and model names
- `SCREAMING_SNAKE_CASE` for constants

---

## 11. Testing Checklist

Before recording your demo video, verify all of the following:

### Authentication
- [ ] Admin can log in via `/api/login` → receives JWT
- [ ] Regular user can log in → receives JWT  
- [ ] Wrong password → 401 response
- [ ] Missing fields → 400 response

### Admin Panel — Admin Role
- [ ] Admin can log into `/admin`
- [ ] Admin sees all 6 resources (User, Category, Product, Order, OrderItem, Setting)
- [ ] Admin can create, edit, and delete records
- [ ] Password field is NOT visible anywhere in AdminJS UI
- [ ] Dashboard shows stats (users, orders, revenue, products)

### Admin Panel — Regular User Role
- [ ] Regular user can log into `/admin`
- [ ] Users table is NOT visible
- [ ] Settings table is NOT visible
- [ ] Write actions (new/edit/delete) are NOT accessible
- [ ] Dashboard shows limited personal view

### Database
- [ ] All tables created with correct columns and foreign keys
- [ ] Seeder runs without errors (`npm run seed`)
- [ ] Associations work (product shows category, order shows user)

### Git
- [ ] At least 5 meaningful commits across feature branches
- [ ] `develop` branch exists with merged features
- [ ] `main` branch is clean and deployable
- [ ] `.env` is NOT committed (`.env.example` is)
- [ ] `README.md` is present with setup instructions

---

## 12. Demo Video Script

Keep the video **under 5 minutes**. Suggested flow:

| Time | What to Show |
|---|---|
| 0:00–0:30 | Brief intro — "This is the eCommerce Admin Dashboard built with AdminJS, Sequelize, and PostgreSQL" |
| 0:30–1:00 | Show the repo structure and key files briefly |
| 1:00–2:00 | Log in as Admin → walk through dashboard, show all resources, create/edit a product |
| 2:00–3:00 | Log in as Regular User → show restricted view (no Users/Settings), show limited dashboard |
| 3:00–4:00 | Show the `/api/login` endpoint working in Postman/curl |
| 4:00–4:30 | Show the GitHub repo, branches, and commit history |
| 4:30–5:00 | Wrap up — mention bonus deployment if applicable |

---

> **Good luck! Focus on clean code, meaningful comments, and a polished Git history — that's what interviewers evaluate beyond just "does it work."**
