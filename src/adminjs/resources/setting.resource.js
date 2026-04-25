/**
 * @file setting.resource.js
 * @description AdminJS resource configuration for the Setting model.
 */

import { Setting } from '../../models/index.js';

export const SettingResource = {
  resource: Setting,
  options: {
    /**
     * Hide from sidebar — the custom Settings page (Settings.jsx) handles the UI.
     * The resource is still registered so the backend API endpoints remain functional.
     */
    navigation: false,
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
    },
  },
};
