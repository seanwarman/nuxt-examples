module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            `${process.env.AWS_S3_BUCKET}.s3.eu-west-2.amazonaws.com`,
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            `${process.env.AWS_S3_BUCKET}.s3.eu-west-2.amazonaws.com`,
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      header: '*',
      origin: [
        'http://localhost:1337',
        'http://localhost:3000',
        'https://content-test.sfh.nomservices.co.uk',
        'https://content-uat.sfh.nomservices.co.uk',
        'https://content.sfh.nomservices.co.uk',
        'https://test.hie.nomensa.xyz',
        'https://uat.hie.nomensa.xyz',
        'https://test.hie.nomensa.xyz'
      ]
    }
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
