/**
 * @file orderItem.resource.js
 * @description AdminJS resource configuration for the OrderItem model.
 * Visible to all users, but only admins can create, edit, or delete order items.
 */

import { OrderItem } from '../../models/index.js';

export const OrderItemResource = {
  resource: OrderItem,
  options: {
    navigation: { name: 'Sales', icon: 'List' },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
      },
      edit: {
        isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
      },
    },
  },
};
