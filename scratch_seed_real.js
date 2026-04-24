import sequelize from './src/config/database.js';
import { Order, User } from './src/models/index.js';

async function seedHistoricalData() {
  try {
    await sequelize.authenticate();
    const admin = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!admin) {
      console.log('Admin user not found. Run standard seed first.');
      return;
    }

    const statuses = ['delivered', 'shipped', 'pending', 'processing', 'cancelled'];
    const months = [0, 1, 2, 3]; // Last 4 months

    console.log('Seeding historical orders...');

    for (const monthOffset of months) {
      const date = new Date();
      date.setMonth(date.getMonth() - monthOffset);
      
      // Add 2-3 orders per month
      for (let i = 0; i < 3; i++) {
        await Order.create({
          userId: admin.id,
          totalAmount: Math.floor(Math.random() * 500) + 50,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          createdAt: date,
          updatedAt: date,
        });
      }
    }

    console.log('Historical data seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedHistoricalData();
