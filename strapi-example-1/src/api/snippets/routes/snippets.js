module.exports = {
  routes: [
    // {
    //  method: 'GET',
    //  path: '/snippets',
    //  handler: 'snippets.exampleAction',
    //  config: {
    //    policies: [],
    //    middlewares: [],
    //  },
    // },
    {
      method: 'GET',
      path: '/snippets',
      handler: 'snippets.find',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/snippets/count',
      handler: 'snippets.count',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/snippets/:id',
      handler: 'snippets.findOne',
      config: {
        policies: []
      }
    },
    {
      method: 'POST',
      path: '/snippets',
      handler: 'snippets.create',
      config: {
        policies: []
      }
    },
    {
      method: 'PUT',
      path: '/snippets/:id',
      handler: 'snippets.update',
      config: {
        policies: []
      }
    },
    {
      method: 'DELETE',
      path: '/snippets/:id',
      handler: 'snippets.delete',
      config: {
        policies: []
      }
    }
  ],
};
