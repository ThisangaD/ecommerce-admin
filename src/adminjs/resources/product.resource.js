/**
 * @file product.resource.js
 * @description AdminJS resource for the Product model.
 * Visible to all authenticated users, but only admins can create/edit/delete.
 */

import { Product } from '../../models/index.js';

export const ProductResource = {
  resource: Product,
  options: {
    navigation: { name: 'Catalog', icon: 'Package' },
    properties: {
      categoryId: {
        reference: 'Category',
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
