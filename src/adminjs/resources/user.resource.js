/**
 * @file user.resource.js
 * @description AdminJS resource configuration for the User model.
 */

import { User } from '../../models/index.js';

/** @type {import('adminjs').ResourceOptions} */
export const UserResource = {
  resource: User,
  options: {
    navigation: { name: 'User Management', icon: 'User' },
    properties: {
      password: {
        isVisible: false,
      },
    },
    /**
     * RBAC: Only admins can manage or see the Users table.
     */
    actions: {
      list: {
        isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
        isVisible: ({ currentAdmin }) => currentAdmin?.role === 'admin'
      },
      show: {
        isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
        isVisible: ({ currentAdmin }) => currentAdmin?.role === 'admin'
      },
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
        isVisible: ({ currentAdmin }) => currentAdmin?.role === 'admin'
      },
      edit: {
        isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
        isVisible: ({ currentAdmin }) => currentAdmin?.role === 'admin'
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
        isVisible: ({ currentAdmin }) => currentAdmin?.role === 'admin'
      },
      bulkDelete: {
        isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
        isVisible: ({ currentAdmin }) => currentAdmin?.role === 'admin'
      },
      search: {
        isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin',
        isVisible: ({ currentAdmin }) => currentAdmin?.role === 'admin'
      }
    },
  },
};
