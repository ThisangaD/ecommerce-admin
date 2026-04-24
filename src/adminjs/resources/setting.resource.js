import { Setting } from '../../models/index.js';

export const SettingResource = {
  resource: Setting,
  options: {
    isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
    isVisible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
  },
};
