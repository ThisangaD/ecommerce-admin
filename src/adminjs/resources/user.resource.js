import { User } from '../../models/index.js';

export const UserResource = {
  resource: User,
  options: {
    properties: {
      password: {
        isVisible: false,
      },
    },
    isAccessible: ({ currentAdmin }) => {
      return currentAdmin && currentAdmin.role === 'admin';
    },
    isVisible: ({ currentAdmin }) => {
      return currentAdmin && currentAdmin.role === 'admin';
    },
  },
};
