import { ARCHIVE_SEARCH_PATH } from './config/paths'
require('dotenv').config()

function generateGtmString() {
  const variables = {
    ...(process.env.GTM_AUTH && { gtm_auth: process.env.GTM_AUTH }),
    ...(process.env.GTM_PREVIEW && { gtm_preview: process.env.GTM_PREVIEW }),
  }
  const queryString = Object.entries(variables).reduce(
    (a, c) => `${a}&${c[0]}=${c[1]}`,
    ''
  )
  return `${process.env.GTM_ID}${queryString}`
}

export default {
  env: {
    apiEndpoint: process.env.API_ENDPOINT || '',
    apiBrowserEndpoint: process.env.API_BROWSER_ENDPOINT || '',
    cmsApiUrl: process.env.CMS_API_URL || '',
  },
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'en-GB',
    },
    titleTemplate: (titleChunk) => {
      // If undefined or blank then we don't need the hyphen
      return titleChunk
        ? `${titleChunk} - DMRB`
        : 'Standards For Highways | Design Manual for Roads and Bridges (DMRB)'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/dmrb/favicons/favicon.ico' },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/dmrb/favicons/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/dmrb/favicons/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/dmrb/favicons/favicon-16x16.png',
      },
      {
        rel: 'manifest',
        href: '/dmrb/favicons/site.webmanifest',
      },
      {
        rel: 'mask-icon',
        href: '/dmrb/favicons/safari-pinned-tab.svg',
        color: '#4d62e4',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Montserrat:500,600,700,800&display=swap',
      },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['@/assets/scss/theme.scss'],
  styleResources: {
    scss: ['@/assets/scss/_variables.scss'],
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/dayjs.js',
    '~/plugins/cms.js',
    { src: '~/plugins/datepicker.js', mode: 'client' },
    { src: '~/plugins/smoothscroll.js', mode: 'client' },
    { src: '~/plugins/click-outside.js', mode: 'client' },
    // { src: '~/plugins/alchemer-surveypopup.js', mode: 'client' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // Doc: https://github.com/nuxt-community/style-resources-module/
    '@nuxtjs/style-resources',
    // Doc: https://github.com/nuxt-community/svg-module
    '@nuxtjs/svg',
    '@nuxtjs/gtm',
  ],
  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: false, // Or `bvCSS: false`
    icons: true,
  },

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.API_ENDPOINT,
    browserBaseURL: process.env.API_BROWSER_ENDPOINT,
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
  rules: {
    test: /\.s[ac]ss$/i,
    use: ['style-loader', 'css-loader', 'sass-loader'],
  },
  router: {
    base: '/dmrb/',
    extendRoutes(routes, resolve) {
      routes.push(
        {
          name: 'Archive Search',
          path: ARCHIVE_SEARCH_PATH,
          component: resolve(__dirname, 'pages/search/index.vue'),
          props: {
            isArchive: true,
          },
        },
        {
          name: 'Archive Document',
          path: `${ARCHIVE_SEARCH_PATH}/:nodeId`,
          component: resolve(__dirname, 'pages/search/_nodeId.vue'),
          props: {
            isArchive: true,
          },
        }
      )
    },

    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) {
        return { selector: to.hash }
      }
      if (from.name === to.name) {
        return { x: window.scrollX, y: window.scrollY }
      }
      return { x: 0, y: 0 }
    },
  },
  gtm: {
    enabled: true,
    pageTracking: true,
    pageViewEventName: 'nuxtRoute',
  },
  publicRuntimeConfig: {
    gtm: {
      id: generateGtmString(),
    },
  },
  // serverMiddleware: ['~/server-middleware/cache_control.js'],
  render: {
    dist: {
      maxAge: '30d',
    },
  },
  components: true,
}
