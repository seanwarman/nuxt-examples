module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: env('UPLOAD_PROVIDER'),
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
        region: env('AWS_DEFAULT_REGION'),
        params: {
          Bucket: env('AWS_S3_BUCKET'),
          CacheControl: "max-age=31536000",
        },
      },
    },
  },
  'wysiwyg': {
    enabled: true,
    resolve: './src/plugins/wysiwyg' // path to plugin folder
  },
});
