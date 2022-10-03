module.exports = {
  routes: [
    // {
    //  method: 'GET',
    //  path: '/dmrb-archive',
    //  handler: 'dmrb-archive.exampleAction',
    //  config: {
    //    policies: [],
    //    middlewares: [],
    //  },
    // },
    {
      method: 'GET',
      path: '/dmrb-archive',
      handler: 'dmrb-archive.find',
      config: {
        policies: []
      }
    },
    {
      method: 'PUT',
      path: '/dmrb-archive',
      handler: 'dmrb-archive.update',
      config: {
        policies: []
      }
    },
    {
      method: 'DELETE',
      path: '/dmrb-archive',
      handler: 'dmrb-archive.delete',
      config: {
        policies: []
      }
    }
  ],
};
