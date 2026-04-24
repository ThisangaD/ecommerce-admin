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
    isAccessible: ({ currentAdmin }) => {
      return currentAdmin && currentAdmin.role === 'admin';
    },
    isVisible: ({ currentAdmin }) => {
      return currentAdmin && currentAdmin.role === 'admin';
    },
  },
};
