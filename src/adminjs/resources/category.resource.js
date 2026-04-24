/**
 * @file category.resource.js
 * @description AdminJS resource configuration for the Category model.
 * Visible to all users, but only admins can create, edit, or delete categories.
 */

import { Category } from '../../models/index.js';

export const CategoryResource = {
  resource: Category,
  options: {
    navigation: { name: 'Catalog', icon: 'Folder' },
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
