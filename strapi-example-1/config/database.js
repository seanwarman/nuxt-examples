module.exports = ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 3307),
      database: env('DATABASE_NAME', 'herbie'),
      user: env('DATABASE_USERNAME', 'herbie'),
      password: env('DATABASE_PASSWORD', 'herbie'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
