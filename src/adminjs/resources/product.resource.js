import { Product } from '../../models/index.js';

export const ProductResource = {
  resource: Product,
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
