const path = require('path')

module.exports = {
  stories: ['../stories/**/*.stories.js'],
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-links',
    '@storybook/addon-viewport/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-storysource',
  ],
  webpack: async (defaultConfig) => {
    defaultConfig.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
        {
          loader: 'sass-resources-loader',
          options: {
            resources: path.resolve(
              __dirname,
              '../assets/scss/_variables.scss'
            ),
          },
        },
      ],
      include: path.resolve(__dirname, '../'),
    })

    return defaultConfig
  },
}
