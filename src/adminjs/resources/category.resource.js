/**
 * @file category.resource.js
 * @description AdminJS resource for the Category model.
 * Visible to all authenticated users, but only admins can create/edit/delete.
 */

import { Category } from '../../models/index.js';

export const CategoryResource = {
  resource: Category,
  options: {
    navigation: { name: 'Catalog', icon: 'Tag' },
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
