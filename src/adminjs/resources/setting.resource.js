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
    isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
    isVisible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
  },
};
