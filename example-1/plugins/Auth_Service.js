export default function (ctx, inject) {
  const b2cPolicies = {
    names: {
      signUpSignIn: ctx.$config.userFlow,
      forgotPassword: "B2C_1_PasswordReset",
      editProfile: "B2C_1_EditProfile",
    },
    authorities: {
      signUpSignIn: {
        authority: `https://${ctx.$config.b2cEnv}.b2clogin.com/${ctx.$config.b2cEnv}.onmicrosoft.com/${ctx.$config.userFlow}`,
      },
      forgotPassword: {
        authority: `https://${ctx.$config.b2cEnv}.b2clogin.com/${ctx.$config.b2cEnv}.onmicrosoft.com/B2C_1_PasswordReset`,
      },
      editProfile: {
        authority: `https://${ctx.$config.b2cEnv}.b2clogin.com/${ctx.$config.b2cEnv}.onmicrosoft.com/B2C_1_EditProfile`,
      },
    },
    authorityDomain: `https://${ctx.$config.b2cEnv}.b2clogin.com/`,
  };
  const apiConfig = {
    b2cScopes: [
      `https://${ctx.$config.b2cEnv}.onmicrosoft.com/applyplot/Readscope`,
      `https://${ctx.$config.b2cEnv}.onmicrosoft.com/applyplot/Writescope`,
    ],
    webApi: "https://fabrikamb2chello.azurewebsites.net/hello",
  };
  const authService = {
    apiConfig: {
      b2cScopes: [
        `https://${ctx.$config.b2cEnv}.onmicrosoft.com/applyplot/Readscope`,
        `https://${ctx.$config.b2cEnv}.onmicrosoft.com/applyplot/Writescope`,
      ],
      webApi: "https://fabrikamb2chello.azurewebsites.net/hello",
    },
    b2cPolicies: {
      names: {
        signUpSignIn: ctx.$config.userFlow,
        forgotPassword: "B2C_1_PasswordReset",
        editProfile: "B2C_1_EditProfile",
      },
      authorities: {
        signUpSignIn: {
          authority: `https://${ctx.$config.b2cEnv}.b2clogin.com/${ctx.$config.b2cEnv}.onmicrosoft.com/${ctx.$config.userFlow}`,
        },
        forgotPassword: {
          authority: `https://${ctx.$config.b2cEnv}}.b2clogin.com/${ctx.$config.b2cEnv}.onmicrosoft.com/B2C_1_PasswordReset`,
        },
        editProfile: {
          authority: `https://${ctx.$config.b2cEnv}.b2clogin.com/${ctx.$config.b2cEnv}.onmicrosoft.com/B2C_1_EditProfile`,
        },
      },
      authorityDomain: `${ctx.$config.b2cEnv}.b2clogin.com`,
    },
    msalConfig: {
      auth: {
        clientId: `${ctx.$config.b2cClientId}`, // "9bd3da7e-29ae-459c-8d66-8932db7157dc", // This is the ONLY mandatory field; everything else is optional.
        authority: b2cPolicies.authorities.signUpSignIn.authority, // Choose sign-up/sign-in user-flow as your default.
        knownAuthorities: [b2cPolicies.authorityDomain], // You must identify your tenant's domain as a known authority.
        redirectUri: `${ctx.$config.redirectUri}`, // You must register this URI on Azure Portal/App Registration. Defaults to "window.location.href".
        // clientSecret: 'V_0k_v.-zlA.NNW30D8vIhUNVrv.Go0IV.'
      },
      cache: {
        cacheLocation: "localStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
        storeAuthStateInCookie: false, // If you wish to store cache items in cookies as well as browser cache, set this to "true".
      },
    },
    loginRequest: {
      scopes: ["openid", ...apiConfig.b2cScopes],
      // client_secret: 'V_0k_v.-zlA.NNW30D8vIhUNVrv.Go0IV.'
    },
    tokenRequest: {
      scopes: [...apiConfig.b2cScopes], // e.g. ["https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read"]
      forceRefresh: false, // Set this to "true" to skip a cached token and go to the server to get a new token
    },
  };
  ctx.authService = authService;
  inject("authService", authService);
}
