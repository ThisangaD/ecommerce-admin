/**
 * @file Setting.js
 * @description Sequelize model for the `settings` table.
 * Stores global application configuration settings.
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
