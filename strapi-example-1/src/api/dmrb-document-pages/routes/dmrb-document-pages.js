module.exports = {
  routes: [
    // {
    //  method: 'GET',
    //  path: '/dmrb-document-page',
    //  handler: 'dmrb-document-page.exampleAction',
    //  config: {
    //    policies: [],
    //    middlewares: [],
    //  },
    // },
    {
      method: 'GET',
      path: '/dmrb-document-pages',
      handler: 'dmrb-document-pages.find',
      config: {
        policies: []
      }
    },
    {
      method: 'PUT',
      path: '/dmrb-document-pages',
      handler: 'dmrb-document-pages.update',
      config: {
        policies: []
      }
    },
    {
      method: 'DELETE',
      path: '/dmrb-document-pages',
      handler: 'dmrb-document-pages.delete',
      config: {
        policies: []
      }
    }
  ],
};
