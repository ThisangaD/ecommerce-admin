/**
 * @file order.resource.js
 * @description AdminJS resource configuration for the Order model.
 */

import { Order } from '../../models/index.js';

export const OrderResource = {
  resource: Order,
  options: {
    navigation: { name: 'Sales', icon: 'ShoppingCart' },
    /**
     * RBAC: Admins see all orders. Users see only their own orders.
     */
    filter: {
      filters: [{
        name: 'userFilter',
        condition: ({ currentAdmin }) => {
          // Admins see all orders; users see only their own
          if (currentAdmin?.role === 'admin') {
            return {};
          }
          return { userId: currentAdmin?.id };
        },
      }],
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
