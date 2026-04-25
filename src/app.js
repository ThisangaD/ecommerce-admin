/**
 * @file app.js
 * @description Main entry point for the eCommerce Admin Dashboard application.
 * Configures Express, Sequelize, and AdminJS with Role-Based Access Control.
 */

import express from 'express';
import AdminJS, { ComponentLoader } from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSSequelize from '@adminjs/sequelize';
import dotenv from 'dotenv';
import session from 'express-session';
import ConnectPgSimple from 'connect-pg-simple';
import path from 'path';
import { fileURLToPath } from 'url';

import sequelize from './config/database.js';
import { 
  User, Category, Product, Order, OrderItem, Setting 
} from './models/index.js';

import { UserResource } from './adminjs/resources/user.resource.js';
import { CategoryResource } from './adminjs/resources/category.resource.js';
import { ProductResource } from './adminjs/resources/product.resource.js';
import { OrderResource } from './adminjs/resources/order.resource.js';
import { OrderItemResource } from './adminjs/resources/orderItem.resource.js';
import { SettingResource } from './adminjs/resources/setting.resource.js';

import { adminAuthenticate } from './adminjs/auth.handler.js';
import authRoutes, { requireAdmin, requireAuth } from './routes/auth.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

AdminJS.registerAdapter(AdminJSSequelize);

const componentLoader = new ComponentLoader();

const Components = {
  Dashboard: componentLoader.add('Dashboard', path.join(__dirname, './adminjs/components/Dashboard.jsx')),
  Settings: componentLoader.add('Settings', path.join(__dirname, './adminjs/components/Settings.jsx')),
};

componentLoader.override('Login', path.join(__dirname, './adminjs/components/Login.jsx'));

const PORT = process.env.PORT || 3000;

/**
 * Starts the Express server and initializes AdminJS.
 */
const start = async () => {
  const app = express();
  app.use(express.json());

  // --- Database Connection & Synchronization ---
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync();

    // --- Session Store Configuration ---
    const PgSession = ConnectPgSimple(session);
    const sessionConfig = {
      resave: false,
      saveUninitialized: true,
      store: new PgSession({
        conObject: {
          connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
        },
        tableName: 'session',
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || 'secret-password-1234567890',
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    };

    // Apply session globally so /api routes can access it
    app.use(session(sessionConfig));

    // Serve static files from public directory
    app.use(express.static(path.join(__dirname, '../public')));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  // --- REST API Routes ---
  app.use('/api', authRoutes);

  // User Dashboard Route — returns recent orders for a specific user
  app.get('/api/user-dashboard', requireAuth, async (req, res) => {
    try {
      const userId = req.query.userId;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      // Security Check: Regular users can only see their own dashboard
      if (req.user.role !== 'admin' && String(req.user.id) !== String(userId)) {
        return res.status(403).json({ error: 'Forbidden: You can only access your own dashboard.' });
      }

      const user = await User.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      });

      const recentOrders = await Order.findAll({
        where: { userId },
        limit: 5,
        order: [['createdAt', 'DESC']],
      });

      const totalOrders = await Order.count({ where: { userId } });
      const orders = await Order.findAll({ where: { userId } });
      const totalSpent = orders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0);

      res.json({
        user,
        recentOrders,
        totalOrders,
        totalSpent: totalSpent.toFixed(2),
      });
    } catch (error) {
      console.error('User Dashboard Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Add Dashboard Stats Route to directly fetch data via Sequelize
  app.get('/api/dashboard-stats', requireAdmin, async (req, res) => {
    try {
      const totalUsers = await User.count();
      const totalOrders = await Order.count();
      const totalProducts = await Product.count();
      const totalCategories = await Category.count();
      
      const orders = await Order.findAll();
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0);

      // --- Calculate Monthly Sales (Last 6 Months) ---
      const monthlySales = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      orders.forEach(order => {
        const date = new Date(order.createdAt);
        const monthKey = monthNames[date.getMonth()];
        monthlySales[monthKey] = (monthlySales[monthKey] || 0) + parseFloat(order.totalAmount || 0);
      });

      const salesChartData = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthName = monthNames[d.getMonth()];
        salesChartData.push({
          month: monthName,
          sales: Math.round(monthlySales[monthName] || 0)
        });
      }

      // --- Calculate Status Distribution ---
      const statusCounts = {};
      orders.forEach(order => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      });

      const totalOrderCount = orders.length || 1;
      const statusStats = [
        { status: 'delivered', percentage: Math.round(((statusCounts['delivered'] || 0) / totalOrderCount) * 100) },
        { status: 'shipped', percentage: Math.round(((statusCounts['shipped'] || 0) / totalOrderCount) * 100) },
        { status: 'pending', percentage: Math.round(((statusCounts['pending'] || 0) / totalOrderCount) * 100) },
      ];

      const recentOrders = await Order.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
      });

      res.json({
        totalUsers,
        totalOrders,
        totalProducts,
        totalCategories,
        totalRevenue: totalRevenue.toFixed(2),
        salesChartData,
        statusStats,
        recentOrders,
      });
    } catch (error) {
      console.error('Dashboard Stats Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- AdminJS Configuration ---
  const adminOptions = {
    resources: [
      UserResource,
      CategoryResource,
      ProductResource,
      OrderResource,
      OrderItemResource,
      SettingResource,
    ],
    branding: {
      companyName: 'SHOP ADMIN',
      logo: '/logo.png',
      favicon: '/logo.png',
      softwareBrothers: false,
      withMadeWithLove: false,
      welcome: 'Welcome to the Premium eCommerce Admin Dashboard',
      theme: {
        colors: {
          primary100: '#4F46E5', // Indigo 600
          hoverBg: '#F8FAFC',
          bg: '#F8FAFC',
          text: '#1E293B',
          sidebar: '#FFFFFF',
          border: '#F1F5F9',
        },
        shadows: {
          card: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        },
        borderRadius: {
          card: '16px',
          button: '10px',
          input: '10px',
        },
      },
    },
    assets: {
      styles: ['/admin-custom.css'],
    },
    rootPath: '/admin',
    dashboard: {
      component: Components.Dashboard,
    },
    pages: {
      Settings: {
        component: Components.Settings,
        icon: 'Settings',
        navigation: { name: 'System', icon: 'Settings' },
        isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
      },
    },
    locale: {
      language: 'en',
      translations: {
        en: {
          labels: {
            users: 'Users',
            categories: 'Categories',
            products: 'Products',
            orders: 'Orders',
            order_items: 'Order Items',
            settings: 'Manage Settings Data',
            System: 'System',
            Catalog: 'Catalog',
            Sales: 'Sales',
            'User Management': 'User Management',
          },
          messages: {
            welcome: 'Welcome to the Premium eCommerce Admin Dashboard.',
            loginWelcome: 'Welcome to the Premium eCommerce Admin Dashboard. Securely manage your store inventory, track sales, and oversee user activity in one central hub.',
          },
          pages: {
            Settings: 'System Settings',
          },
        },
      },
    },
    componentLoader,
  };

  const admin = new AdminJS(adminOptions);

  // In development, watch for changes and rebuild bundle
  if (process.env.NODE_ENV !== 'production') {
    admin.watch();
  }

  // --- Session Store & Authentication ---
  const PgSession = ConnectPgSimple(session);
  
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: adminAuthenticate,
      cookieName: 'adminjs',
      cookiePassword: process.env.SESSION_SECRET || 'secret-password-1234567890',
    },
    null, // Use the global session middleware instead of defining a new one here
  );

  app.use(admin.options.rootPath, adminRouter);

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('[Server Error]:', err);
    res.status(500).send({ error: 'Internal Server Error', details: err.message });
  });

  app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 AdminJS is available on http://localhost:${PORT}${admin.options.rootPath}\n`);
  });
};

start();
