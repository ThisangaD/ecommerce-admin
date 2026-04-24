/**
 * @file OrderItem.js
 * @description Sequelize model for the `order_items` table.
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
