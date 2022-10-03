module.exports = {
  routes: [
    // {
    //  method: 'GET',
    //  path: '/dmrb-search-results',
    //  handler: 'dmrb-search-results.exampleAction',
    //  config: {
    //    policies: [],
    //    middlewares: [],
    //  },
    // },
    {
      method: 'GET',
      path: '/dmrb-search-results',
      handler: 'dmrb-search-results.find',
      config: {
        policies: []
      }
    },
    {
      method: 'PUT',
      path: '/dmrb-search-results',
      handler: 'dmrb-search-results.update',
      config: {
        policies: []
      }
    },
    {
      method: 'DELETE',
      path: '/dmrb-search-results',
      handler: 'dmrb-search-results.delete',
      config: {
        policies: []
      }
    }
  ],
};
