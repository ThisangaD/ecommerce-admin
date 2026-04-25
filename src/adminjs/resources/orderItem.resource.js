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
    /**
     * RBAC: Control column visibility based on user role.
     * Users can only see: unitPrice, quantity, productId
     */
    properties: {
      id: {
        isVisible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
      },
      orderId: {
        isVisible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
      },
      createdAt: {
        isVisible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
      },
      updatedAt: {
        isVisible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
      },
      unitPrice: {
        isVisible: true,
      },
      quantity: {
        isVisible: true,
      },
      productId: {
        isVisible: true,
      },
    },
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
