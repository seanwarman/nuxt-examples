module.exports = {
  routes: [
    // {
    //  method: 'GET',
    //  path: '/dmrb-home',
    //  handler: 'dmrb-home.exampleAction',
    //  config: {
    //    policies: [],
    //    middlewares: [],
    //  },
    // },
    {
      method: 'GET',
      path: '/dmrb-home',
      handler: 'dmrb-home.find',
      config: {
        policies: []
      }
    },
    {
      method: 'PUT',
      path: '/dmrb-home',
      handler: 'dmrb-home.update',
      config: {
        policies: []
      }
    },
    {
      method: 'DELETE',
      path: '/dmrb-home',
      handler: 'dmrb-home.delete',
      config: {
        policies: []
      }
    }
  ],
};
