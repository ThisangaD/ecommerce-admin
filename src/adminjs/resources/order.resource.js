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
