module.exports = {
  routes: [
    // {
    //  method: 'GET',
    //  path: '/dmrb-updates',
    //  handler: 'dmrb-updates.exampleAction',
    //  config: {
    //    policies: [],
    //    middlewares: [],
    //  },
    // },
    {
      method: 'GET',
      path: '/dmrb-updates',
      handler: 'dmrb-updates.find',
      config: {
        policies: []
      }
    },
    {
      method: 'PUT',
      path: '/dmrb-updates',
      handler: 'dmrb-updates.update',
      config: {
        policies: []
      }
    },
    {
      method: 'DELETE',
      path: '/dmrb-updates',
      handler: 'dmrb-updates.delete',
      config: {
        policies: []
      }
    }
  ],
};
