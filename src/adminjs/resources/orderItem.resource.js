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
      id: { isVisible: true },
      orderId: { isVisible: true },
      createdAt: { isVisible: true },
      updatedAt: { isVisible: true },
      unitPrice: { isVisible: true },
      quantity: { isVisible: true },
      productId: { isVisible: true },
    },
    actions: {
      list: {
        after: async (response, request, context) => {
          const { currentAdmin } = context;
          if (currentAdmin && currentAdmin.role !== 'admin') {
            if (response.records && response.records.length) {
              response.records.forEach((record) => {
                // Strip restricted fields from the record params
                record.params.orderId = null;
              });
            }
          }
          return response;
        },
      },
      show: {
        after: async (response, request, context) => {
          const { currentAdmin } = context;
          if (currentAdmin && currentAdmin.role !== 'admin') {
            if (response.record && response.record.params) {
              response.record.params.orderId = null;
            }
          }
          return response;
        },
      },
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
        isVisible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
      },
      edit: {
        isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
        isVisible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
        isVisible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
        isVisible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
      },
    },
  },
};
