/**
 * @file order.resource.js
 * @description AdminJS resource configuration for the Order model.
 * Includes custom filtering logic for regular users.
 */

import { Order } from '../../models/index.js';

export const OrderResource = {
  resource: Order,
  options: {
    actions: {
      list: {
        /**
         * Before hook to filter orders based on the logged-in user's role.
         * Admins see all orders; Regular users only see their own.
         */
        before: async (request, context) => {
          const { currentAdmin } = context;
          if (currentAdmin.role !== 'admin') {
            request.query = {
              ...request.query,
              'filter.userId': currentAdmin.id,
            };
          }
          return request;
        },
      },
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === 'admin',
      },
      edit: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === 'admin',
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === 'admin',
      },
    },
  },
};
