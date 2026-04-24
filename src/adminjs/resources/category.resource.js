import { Category } from '../../models/index.js';

export const CategoryResource = {
  resource: Category,
  options: {
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === 'admin',
      },
      edit: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === 'admin',
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === 'admin',
      },
    },
  },
};
