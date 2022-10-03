module.exports = {
  routes: [
    // {
    //  method: 'GET',
    //  path: '/dmrb-help',
    //  handler: 'dmrb-help.exampleAction',
    //  config: {
    //    policies: [],
    //    middlewares: [],
    //  },
    // },
    {
      method: 'GET',
      path: '/dmrb-help',
      handler: 'dmrb-help.find',
      config: {
        policies: []
      }
    },
    {
      method: 'PUT',
      path: '/dmrb-help',
      handler: 'dmrb-help.update',
      config: {
        policies: []
      }
    },
    {
      method: 'DELETE',
      path: '/dmrb-help',
      handler: 'dmrb-help.delete',
      config: {
        policies: []
      }
    }
  ],
};
