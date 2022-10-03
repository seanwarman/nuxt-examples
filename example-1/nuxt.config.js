import webpack from "webpack";

const masterCode = "be8WzyGSFaqMuYZK5kUlDZLWbLy9dkhVkWHRhdM01E1FFwRzsBySXw==";

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: "server",

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: "dbw-digital-transformation",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    htmlAttrs: {
      lang: "en",
    },
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ["@/assets/scss/main.scss"],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    "~/plugins/Middleware_Service.js",
    "~/plugins/Auth_Service.js",
    "~/plugins/Address_Service.js",
    "~/plugins/CompaniesHouseApi_Service.js",
    "~/plugins/user-account-area/UserAccountApplications_GET_Service.js",
    "~/plugins/plot-application/PlotApplication_APPLY_Service.js",
    "~/plugins/plot-application/PlotApplication_GET_Service.js",
    "~/plugins/plot-application/PlotApplication_POST_Service.js",
    "~/plugins/decision-in-principle/DecisionInPrinciple_GET_Service.js",
    "~/plugins/decision-in-principle/DecisionInPrinciple_POST_Service.js",
    "~/plugins/detailed-application/DetailedApplication_GET_Service.js",
    "~/plugins/detailed-application/DetailedApplication_POST_Service.js",
    "~/plugins/investment-application/InvestmentApplications_GET_Service.js",
    "~/plugins/investment-application/InvestmentApplication_GET_Service.js",
    "~/plugins/investment-application/InvestmentApplication_CREATE_Service.js",
    "~/plugins/investment-application/InvestmentApplication_UPDATE_Service.js",
    "~/plugins/ma-ifa/IndependentFinancialAdviser_GET_Service.js",
    "~/plugins/ma-ifa/CreateIndependentFinancialAdviser_POST_Service.js",
    "~/plugins/ma-ifa/IndependentFinancialAdviserAddContact_POST_Service.js",
    "~/plugins/ma-ifa/assignIndependentFinancialAdviser_POST_Service.js",
    "~/plugins/ma-ifa/findIndependentFinancialAdviserCompanies_GET_Service.js",
    "~/plugins/ma-ifa/updateIndependentFinancialAdviserStatus_POST_Service.js",
    "~/plugins/ma-ifa/getIndependentFinancialAdviserByCaseReferance_GET_Service.js",
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    "@nuxtjs/i18n",
    "@nuxtjs/axios",
    "@nuxtjs/style-resources",
    "bootstrap-vue/nuxt",
    "@nuxtjs/gtm",
    [
      "nuxt-vuex-localstorage",
      {
        mode: "debug",
        localStorage: [
          "localStorage",
          "Global",
          "DecisionInPrinciple",
          "PlotApplication",
          "DetailedApplication",
          "InvestmentApplication",
        ],
      },
    ],
  ],

  // Google Tag manager config
  gtm: {
    enabled: true,
    pageTracking: true,
    pageViewEventName: "nuxtRoute",
    // respectDoNotTrack: false,
    id: process.env.GTM_ID || "GTM-NBSRFKF",
    scriptDefer: false,
    // scriptURL: 'https://tagassistant.google.com/#source=TAG_MANAGER',
    variables: {
      gtm_auth: process.env.GTM_AUTH || "qVNHKzgu35MMUTErV4MlPw",
      gtm_preview: process.env.GTM_PREVIEW || "env-5",
    },
  },

  serverMiddleware: [
    {
      path: "/server-middleware",
      handler: "~/server-middleware/fileUpload.js",
    },
  ],

  // config for bootstrap-vue
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    icons: true,
  },

  styleResources: {
    scss: "@/assets/scss/_variables.scss",
  },

  // Build Configurations (https://go.nuxtjs.dev/config-build)
  build: {
    // add VSCode debugging when used with launch.json
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.html$/i,
        loader: "raw-loader",
      });
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? "source-map" : "inline-source-map";
      }
    },
    transpile: ["nuxt-vuex-localstorage"],
    plugins: [
      new webpack.ProvidePlugin({
        // global modules
        _: "lodash",
      }),
    ],
  },

  publicRuntimeConfig: {
    baseUrl: process.env.BASE_URL || "http://localhost:3000",

    // Address Lookup
    addressApiToken:
      process.env.ADDRESSIAN_API_TOKEN ||
      "MmvPgXXmbq8mbklz8iOzn7sIzb7O1WKd1UYLnr03",

    // Companies House
    companiesHouseApiToken:
      // process.env... ||
      "2e92d439-c394-4a7a-9e96-be31d71c3a8d",

    // B2C
    b2cClientId:
      process.env.B2C_CLIENT_ID || "7d620af4-c78b-4512-a623-44321d915866",
    b2cUri: process.env.B2C_URI || "https://dbwb2cdev.onmicrosoft.com/",
    b2cEnv: process.env.B2C_ENV || "dbwb2cdev",
    redirectUri: process.env.B2C_REDIRECT_URI || "http://localhost:3000",
    userFlow: process.env.B2C_USERFLOW || "B2C_1_SignUpAndSignIn",

    // User Account Area
    userAccountApplicationsDataUri:
      process.env.USER_ACCOUNT_DATA_URI ||
      `https://funcapp-devdbw-useracc.azurewebsites.net/api/GetContactCases?code=${masterCode}`,

    // Plot Application
    plotApplyUri:
      process.env.PLOT_APPLY_URI ||
      `https://funcapp-devdbw-plotapp.azurewebsites.net/api/ApplyPlot?code=${masterCode}`,
    plotDataUri:
      process.env.PLOT_DATA_URI ||
      `https://funcapp-devdbw-plotapp.azurewebsites.net/api/GetPlotApplication?code=${masterCode}`,
    plotPostUri:
      process.env.PLOT_POST_URI ||
      `https://funcapp-devdbw-plotapp.azurewebsites.net/api/UpdatePlotApplication?code=${masterCode}`,

    // Decision In Principle
    dipDataUri:
      process.env.DIP_DATA_URI ||
      `https://funcapp-devdbw-dip.azurewebsites.net/api/GetDecisionInPrinciple?code=${masterCode}`,
    dipPostUri:
      process.env.DIP_POST_URI ||
      `https://funcapp-devdbw-dip.azurewebsites.net/api/UpdateDecisionInPrinciple?code=${masterCode}`,

    // Detailed Application
    detailedDataUri:
      process.env.DETAILED_DATA_URI ||
      `https://funcapp-devdbw-plotapp.azurewebsites.net/api/GetDetailedPlotApplication?code=${masterCode}`,
    detailedPostUri:
      process.env.DETAILED_POST_URI ||
      `https://funcapp-devdbw-plotapp.azurewebsites.net/api/UpdateDetailedPlotApplication?code=${masterCode}`,

    // Investment Application
    investmentApplicationsGetServiceUri:
      process.env.INV_APPS_DATA_URI ||
      `https://funcapp-devdbw-invapp.azurewebsites.net/api/GetInvestmentApplications?code=${masterCode}`,
    investmentApplicationGetServiceUri:
      process.env.INV_APP_DATA_URI ||
      `https://funcapp-devdbw-invapp.azurewebsites.net/api/GetInvestmentApplication?code=${masterCode}`,
    investmentApplicationCreateServiceUri:
      process.env.INV_APP_CREATE_URI ||
      `https://funcapp-devdbw-invapp.azurewebsites.net/api/InvestmentApplication?code=${masterCode}`,
    investmentApplicationUpdateServiceUri:
      process.env.INV_APP_UPDATE_URI ||
      `https://funcapp-devdbw-invapp.azurewebsites.net/api/UpdateInvestmentApplication?code=${masterCode}`,

    // IFA Registration
    createIFACompanyPostUri:
      process.env.IFA_CREATE_COMPANY_URI ||
      `https://funcapp-devdbw-userreg.azurewebsites.net/api/CreateIfaCompany?code=${masterCode}`,
    ifaContactAddUri:
      process.env.IFA_REGISTER_POST_URI ||
      `https://funcapp-devdbw-userreg.azurewebsites.net/api/AddContactToIfaCompany?code=${masterCode}`,
    ifaGetUri:
      process.env.IFA_REGISTER_GET_IFA_URI ||
      `https://funcapp-devdbw-userreg.azurewebsites.net/api/GetIfa?code=${masterCode}`,
    getIFACompaniesUri:
      process.env.IFA_GET_COMPANIES_URI ||
      `https://funcapp-devdbw-useracc.azurewebsites.net/api/GetIfaCompanies?code=${masterCode}`,
    assignIFAToCaseUri:
      process.env.IFA_ASSIGN_TO_CASE_URI ||
      `https://funcapp-devdbw-plotapp.azurewebsites.net/api/AssignAdvisorToCase?code=${masterCode}`,
    updateIFAStatus:
      process.env.IFA_UPDATE_ADVISOR_STATUS_URI ||
      `https://funcapp-devdbw-plotapp.azurewebsites.net/api/UpdateAdvisorStatus?code=${masterCode}`,
    getIFAByCaseRef:
      process.env.IFA_GET_BY_CASE_REF ||
      `https://funcapp-devdbw-useracc.azurewebsites.net/api/GetIfaByCaseReference?code=${masterCode}`,

    // Google Tag manager config
    gtm: {
      pageTracking: true,
      pageViewEventName: "nuxtRoute",
      id: process.env.GTM_ID,
      variables: {
        gtm_auth: process.env.GTM_AUTH || "376267",
        gtm_preview: process.env.GTM_PREVIEW || "env-5",
      },
    },
  },
  i18n: {
    locales: [
      { code: "en", file: "en.js" },
      { code: "cy", file: "cy.js" },
    ],
    vueI18n: {
      fallbackLocale: "en",
    },
    defaultLocale: "en",
    strategy: "no_prefix",
    langDir: "~/locales/",
  },
};
