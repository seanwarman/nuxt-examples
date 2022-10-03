module.exports = ({ env }) => ({
  apiToken: {
    salt: env('API_TOKEN_SALT', '/a8A4uEKdGHgQgWBdzh2+A=='),
  },
  auth: {
    secret: env('ADMIN_JWT_SECRET', '269abf4182180aa2705b8e09bdeaf487'),
  },
});
