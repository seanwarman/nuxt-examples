module.exports = {
  routes: [
    // {
    //  method: 'GET',
    //  path: '/notices',
    //  handler: 'notices.exampleAction',
    //  config: {
    //    policies: [],
    //    middlewares: [],
    //  },
    // },
    {
      method: 'GET',
      path: '/notices',
      handler: 'notices.find',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/notices/count',
      handler: 'notices.count',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/notices/:id',
      handler: 'notices.findOne',
      config: {
        policies: []
      }
    },
    {
      method: 'POST',
      path: '/notices',
      handler: 'notices.create',
      config: {
        policies: []
      }
    },
    {
      method: 'PUT',
      path: '/notices/:id',
      handler: 'notices.update',
      config: {
        policies: []
      }
    },
    {
      method: 'DELETE',
      path: '/notices/:id',
      handler: 'notices.delete',
      config: {
        policies: []
      }
    }
  ],
};
