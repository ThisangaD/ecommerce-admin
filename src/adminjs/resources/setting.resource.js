/**
 * @file setting.resource.js
 * @description AdminJS resource configuration for the Setting model.
 */

import { Setting } from '../../models/index.js';

export const SettingResource = {
  resource: Setting,
  options: {
    navigation: { name: 'System', icon: 'Database' },
    /**
     * RBAC: Settings are for system-wide configuration, accessible only by admins.
     */
    actions: {
      list: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
      show: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
      new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
      edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
      delete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
      bulkDelete: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
    },
  },
};
