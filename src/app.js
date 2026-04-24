import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSSequelize from '@adminjs/sequelize';
import dotenv from 'dotenv';
import session from 'express-session';
import ConnectPgSimple from 'connect-pg-simple';

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
import authRoutes from './routes/auth.routes.js';
import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

const Components = {
  Dashboard: componentLoader.add('Dashboard', './adminjs/components/Dashboard.jsx'),
  Settings: componentLoader.add('Settings', './adminjs/components/Settings.jsx'),
};

dotenv.config();

AdminJS.registerAdapter(AdminJSSequelize);

const PORT = process.env.PORT || 3000;

const start = async () => {
  const app = express();
  app.use(express.json());

  // Database Connection
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    // Sync models
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  // API Routes
  app.use('/api', authRoutes);

  // AdminJS Setup
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
      companyName: 'eCommerce Admin',
      softwareBrothers: false,
    },
    rootPath: '/admin',
    dashboard: {
      component: Components.Dashboard,
    },
    pages: {
      Settings: {
        component: Components.Settings,
        icon: 'Settings',
      },
    },
    componentLoader,
  };

  const admin = new AdminJS(adminOptions);

  const PgSession = ConnectPgSimple(session);
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: adminAuthenticate,
      cookieName: 'adminjs',
      cookiePassword: process.env.SESSION_SECRET || 'secret-password',
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
      store: new PgSession({
        conObject: {
          connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
        },
        tableName: 'session',
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || 'secret-password',
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    }
  );

  app.use(admin.options.rootPath, adminRouter);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`AdminJS is available on http://localhost:${PORT}${admin.options.rootPath}`);
  });
};

start();
