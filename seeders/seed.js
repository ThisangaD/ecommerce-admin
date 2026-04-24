/**
 * @file seed.js
 * @description Database seeder script.
 * Populates the database with initial admin users, categories, products, and settings.
 * Use with caution: 'sync({ force: true })' will wipe the existing database.
 */

import { User, Category, Product, Setting } from '../src/models/index.js';
import { hashPassword } from '../src/utils/hash.utils.js';
import sequelize from '../src/config/database.js';

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced.');

    // Create session table for AdminJS (connect-pg-simple)
    await sequelize.query(`
      DROP TABLE IF EXISTS "session" CASCADE;
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL PRIMARY KEY COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
      ) WITH (OIDS=FALSE);
      
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);
    console.log('Session table ensured.');

    // Create Admin User
    const adminPassword = await hashPassword('admin123');
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
    });
    console.log('Admin user created: admin@example.com / admin123');

    // Create Regular User
    const userPassword = await hashPassword('user123');
    await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
    });
    console.log('Regular user created: user@example.com / user123');

    // Create Categories
    const electronics = await Category.create({ name: 'Electronics', description: 'Gadgets and devices' });
    const clothing = await Category.create({ name: 'Clothing', description: 'Apparel and fashion' });

    // Create Products
    await Product.create({
      name: 'Smartphone',
      description: 'Latest model smartphone',
      price: 699.99,
      stock: 50,
      categoryId: electronics.id,
    });

    await Product.create({
      name: 'Laptop',
      description: 'High performance laptop',
      price: 1299.99,
      stock: 30,
      categoryId: electronics.id,
    });

    await Product.create({
      name: 'T-Shirt',
      description: 'Cotton t-shirt',
      price: 19.99,
      stock: 100,
      categoryId: clothing.id,
    });

    // Create Settings
    await Setting.create({ key: 'site_name', value: 'My eCommerce Store', description: 'Public site name' });
    await Setting.create({ key: 'support_email', value: 'support@example.com', description: 'Customer support contact' });

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seed();
