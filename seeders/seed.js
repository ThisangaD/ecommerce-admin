/**
 * @file seed.js
 * @description Database seeder script.
 * Populates the database with initial admin users, categories, products, orders, and settings.
 * Use with caution: 'sync({ force: true })' will wipe the existing database.
 */

import { User, Category, Product, Order, OrderItem, Setting } from '../src/models/index.js';
import { hashPassword } from '../src/utils/hash.utils.js';
import sequelize from '../src/config/database.js';

const seed = async () => {
  try {
    console.log('Starting seeding process...');
    await sequelize.sync({ force: true });
    console.log('Database wiped and synced.');

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

    // --- Users ---
    const adminPassword = await hashPassword('admin123');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
    });

    const userPassword = await hashPassword('user123');
    const user1 = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: userPassword,
      role: 'user',
    });
    console.log('Users created.');

    // --- Categories ---
    const electronics = await Category.create({ name: 'Electronics', description: 'Gadgets and high-tech devices' });
    const clothing = await Category.create({ name: 'Clothing', description: 'Apparel, shoes, and accessories' });
    const home = await Category.create({ name: 'Home & Kitchen', description: 'Furniture and kitchenware' });
    const books = await Category.create({ name: 'Books', description: 'Educational and fiction books' });
    console.log('Categories created.');

    // --- Products ---
    const p1 = await Product.create({
      name: 'Smartphone X',
      description: 'Latest model with 5G support',
      price: 799.99,
      stock: 45,
      categoryId: electronics.id,
    });

    const p2 = await Product.create({
      name: 'Professional Laptop',
      description: 'High performance for developers',
      price: 1499.00,
      stock: 20,
      categoryId: electronics.id,
    });

    const p3 = await Product.create({
      name: 'Wireless Headphones',
      description: 'Noise cancelling Bluetooth headphones',
      price: 199.50,
      stock: 60,
      categoryId: electronics.id,
    });

    const p4 = await Product.create({
      name: 'Designer T-Shirt',
      description: 'Premium cotton comfort fit',
      price: 29.99,
      stock: 120,
      categoryId: clothing.id,
    });

    const p5 = await Product.create({
      name: 'Denim Jacket',
      description: 'Classic blue denim',
      price: 89.00,
      stock: 40,
      categoryId: clothing.id,
    });

    const p6 = await Product.create({
      name: 'Coffee Maker',
      description: 'Automatic espresso machine',
      price: 249.99,
      stock: 15,
      categoryId: home.id,
    });

    const p7 = await Product.create({
      name: 'Modern Fiction Novel',
      description: 'Bestselling drama of the year',
      price: 14.95,
      stock: 200,
      categoryId: books.id,
    });
    console.log('Products created.');

    // --- Orders & Order Items ---
    
    // Order 1 for John Doe (user1)
    const order1 = await Order.create({
      userId: user1.id,
      status: 'delivered',
      totalAmount: 829.98,
    });
    await OrderItem.create({ orderId: order1.id, productId: p1.id, quantity: 1, unitPrice: 799.99 });
    await OrderItem.create({ orderId: order1.id, productId: p4.id, quantity: 1, unitPrice: 29.99 });

    // Order 2 for John Doe (user1)
    const order2 = await Order.create({
      userId: user1.id,
      status: 'processing',
      totalAmount: 199.50,
    });
    await OrderItem.create({ orderId: order2.id, productId: p3.id, quantity: 1, unitPrice: 199.50 });

    // Order 3 for Jane Smith (user2)
    const order3 = await Order.create({
      userId: user2.id,
      status: 'pending',
      totalAmount: 1528.99,
    });
    await OrderItem.create({ orderId: order3.id, productId: p2.id, quantity: 1, unitPrice: 1499.00 });
    await OrderItem.create({ orderId: order3.id, productId: p4.id, quantity: 1, unitPrice: 29.99 });

    // Order 4 for Admin (as a test)
    const order4 = await Order.create({
      userId: admin.id,
      status: 'shipped',
      totalAmount: 14.95,
    });
    await OrderItem.create({ orderId: order4.id, productId: p7.id, quantity: 1, unitPrice: 14.95 });

    console.log('Orders and OrderItems created.');

    // --- Settings ---
    await Setting.create({ 
      key: 'site_name', 
      value: 'Premium eCommerce Admin', 
      description: 'The name of the storefront displayed to customers.' 
    });
    await Setting.create({ 
      key: 'support_email', 
      value: 'contact@premium-store.com', 
      description: 'Main contact email for customer inquiries.' 
    });
    await Setting.create({ 
      key: 'currency', 
      value: 'USD', 
      description: 'The primary currency used for transactions.' 
    });
    await Setting.create({ 
      key: 'maintenance_mode', 
      value: 'false', 
      description: 'If true, the public site will be hidden.' 
    });
    console.log('Settings created.');

    console.log('\n✅ Seeding completed successfully!');
    console.log('-----------------------------------');
    console.log('Admin:  admin@example.com / admin123');
    console.log('User 1: user@example.com / user123');
    console.log('User 2: jane@example.com / user123');
    console.log('-----------------------------------\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seed();
