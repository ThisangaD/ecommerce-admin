/**
 * @file order.resource.js
 * @description AdminJS resource configuration for the Order model.
 */

import { Order } from '../../models/index.js';

export const OrderResource = {
  resource: Order,
  options: {
    navigation: { name: 'Sales', icon: 'ShoppingCart' },
    actions: {
      list: {
        before: async (request, context) => {
          const { currentAdmin } = context;
          if (currentAdmin && currentAdmin.role !== 'admin') {
            request.query = {
              ...request.query,
              'filters.userId': currentAdmin.id,
            };
          }
          return request;
        },
      },
      show: {
        isAccessible: ({ currentAdmin, record }) => {
          if (!currentAdmin) return false;
          if (currentAdmin.role === 'admin') return true;
          if (!record) return true;
          // Both adminjs record.params.userId and currentAdmin.id could be numbers or strings
          return String(record.params.userId) === String(currentAdmin.id);
        },
        isVisible: ({ currentAdmin, record }) => {
          if (!currentAdmin) return false;
          if (currentAdmin.role === 'admin') return true;
          if (!record) return true;
          return String(record.params.userId) === String(currentAdmin.id);
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
