import { Order } from '../../models/index.js';

export const OrderResource = {
  resource: Order,
  options: {
    actions: {
      list: {
        before: async (request, context) => {
          const { currentAdmin } = context;
          if (currentAdmin.role !== 'admin') {
            request.query = {
              ...request.query,
              'filter.userId': currentAdmin.id,
            };
          }
          return request;
        },
      },
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
