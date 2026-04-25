<div align="center">
  <img src="public/logo.png" alt="Premium Admin Logo" width="200" style="margin-bottom: 20px;"/>
  <h1>🛒 Premium eCommerce Admin Dashboard</h1>
  <p>
    <strong>A high-performance, responsive, and secure role-based administration panel.</strong><br>
    <em>Built with AdminJS, Express, PostgreSQL, and beautifully styled with custom React components.</em>
  </p>

  [![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Express.js-Backend-000000?logo=express&logoColor=white)](https://expressjs.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![AdminJS](https://img.shields.io/badge/AdminJS-Dashboard-4F46E5?logo=react&logoColor=white)](https://adminjs.co/)
  [![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
</div>

<br>

## ✨ Key Features

- **🎨 Premium UI & Responsive Design** — Custom glassmorphism-inspired dashboards, circuit-board animated login screens, and fluid scaling for desktop, tablet, and mobile devices.
- **🔐 JWT & Session Security** — Industry-standard `bcrypt` hashing, secure JWT endpoints, and robust session handling via `connect-pg-simple`.
- **🛡️ Strict Role-Based Access Control (RBAC)** — Comprehensive permission rules. Admins have omnipotent control, while standard users experience a restricted, secure, read-only ecosystem tailored to their own data.
- **📊 Real-Time Analytics Dashboard** — A custom-built React dashboard displaying dynamic sales overview charts, order status distributions, and revenue calculations.
- **⚙️ Dynamic System Settings** — A dedicated configuration tab allowing admins to manage global application variables effortlessly.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|-------|-----------|-------------|
| **Runtime** | Node.js (v18+) | Core JavaScript runtime |
| **Framework** | Express.js | Lightweight backend web framework |
| **ORM** | Sequelize v6 | Promise-based Node.js ORM |
| **Database** | PostgreSQL | Robust relational database |
| **Admin UI** | AdminJS v7 | Auto-generated & heavily customized React panel |
| **Auth** | JWT + bcrypt | Token-based API auth and password hashing |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.x` or higher
- PostgreSQL installed and running on your local machine

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ThisangaD/ecommerce-admin.git
   cd ecommerce-admin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup the Database:**
   Ensure your local PostgreSQL server is running, then create the database:
   ```bash
   psql -U postgres -c "CREATE DATABASE ecommerce_admin;"
   ```

4. **Environment Configuration:**
   Create a `.env` file from the example template and fill in your database credentials:
   ```bash
   cp .env.example .env
   ```

5. **Seed Initial Data:**
   Populate the database with sample users, products, and orders:
   ```bash
   npm run seed
   ```

6. **Ignite the Server:**
   ```bash
   npm run dev
   ```
   > 🌐 Application will be running at `http://localhost:3000/admin`

---

## 🔑 Authentication & Testing

### Default Credentials
Upon seeding, the following accounts are available for testing RBAC features:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | `admin@example.com` | `admin123` | Full Access & Analytics |
| **User** | `user@example.com` | `user123` | Personal Dashboard & Read-only Data |

---

## 📁 Project Architecture

```
ecommerce-admin/
├── public/                  # Static assets (Custom CSS, Logos)
├── src/
│   ├── adminjs/
│   │   ├── components/      # Custom React UI (Dashboard, Login, Settings)
│   │   ├── resources/       # AdminJS schema definitions & RBAC
│   │   └── auth.handler.js  # Authentication middleware
│   ├── config/              # Sequelize DB connection
│   ├── models/              # Sequelize Data Models
│   ├── routes/              # Express API Routes
│   ├── utils/               # JWT & Hashing helpers
│   └── app.js               # Main Application Bootstrap
├── seeders/                 # Database initialization scripts
└── package.json
```

---

## 🤝 Contribution Guidelines

This project maintains a clean, readable Git history using **Conventional Commits**:
- `feat:` — Introduces a new feature to the codebase
- `fix:` — Patches a bug in the codebase
- `style:` — Code formatting and UI aesthetic changes
- `chore:` — Routine tasks, dependency updates, and maintenance

---

<div align="center">
  <p>Built with ❤️ for modern eCommerce management.</p>
</div>
