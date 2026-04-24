/**
 * @file product.resource.js
 * @description AdminJS resource configuration for the Product model.
 */

import { Product } from '../../models/index.js';

export const ProductResource = {
  resource: Product,
  options: {
    navigation: { name: 'Catalog', icon: 'Package' },
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
