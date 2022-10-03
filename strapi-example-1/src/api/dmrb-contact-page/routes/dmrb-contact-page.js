module.exports = {
  routes: [
    // {
    //  method: 'GET',
    //  path: '/dmrb-contact-page',
    //  handler: 'dmrb-contact-page.exampleAction',
    //  config: {
    //    policies: [],
    //    middlewares: [],
    //  },
    // },
    {
      method: 'GET',
      path: '/dmrb-contact-page',
      handler: 'dmrb-contact-page.find',
      config: {
        policies: []
      }
    },
    {
      method: 'PUT',
      path: '/dmrb-contact-page',
      handler: 'dmrb-contact-page.update',
      config: {
        policies: []
      }
    },
    {
      method: 'DELETE',
      path: '/dmrb-contact-page',
      handler: 'dmrb-contact-page.delete',
      config: {
        policies: []
      }
    }
  ],
};
