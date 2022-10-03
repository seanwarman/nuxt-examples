export const state = () => ({
  Brand: "sbw",
  LoggedIn: false,
  Language: "en",
  AccountData: {
    HomeAccountId: null,
    Email: null,
    FirstName: null,
    LastName: null,
    MobileNumber: null,
    StreetAddress: null,
    City: null,
    Country: null,
    PostCode: null,
    LanguagePreference: null,
    IFA: false,
  },
  ReadOnlyPA: true,
  ReadOnlyDIP: true,
  ReadOnlyDA: true,
  ReadOnlyIA: false,
  ApiOptions: {
    params: {},
    headers: {},
  },
  //
  SelectedCase: null,
  FormType: false,
});

export const getters = {
  Brand: (state) => {
    return state.Brand;
  },
  LoggedIn: (state) => {
    return state.LoggedIn;
  },
  AccountData: (state) => {
    return state.AccountData;
  },
  ReadOnlyPA: (state) => {
    return state.ReadOnlyPA;
  },
  ReadOnlyDIP: (state) => {
    return state.ReadOnlyDIP;
  },
  ReadOnlyDA: (state) => {
    return state.ReadOnlyDA;
  },
  ReadOnlyIA: (state) => {
    return state.ReadOnlyIA;
  },
  ApiOptions: (state) => {
    return state.ApiOptions;
  },
  SelectedCase: (state) => {
    return state.SelectedCase;
  },
};

export const mutations = {
  resetGlobalData(state) {
    state.Brand = "sbw";
    state.LoggedIn = false;
    state.AccountData = {
      HomeAccountId: null,
      Email: null,
      FirstName: null,
      LastName: null,
      MobileNumber: null,
      StreetAddress: null,
      City: null,
      Country: null,
      PostCode: null,
      LanguagePreference: null,
      IFA: false,
    };
    state.ReadOnlyPA = true;
    state.ReadOnlyDIP = true;
    state.ReadOnlyDA = true;
    state.ReadOnlyIA = false;
    state.ApiOptions = {
      params: {},
      headers: {},
    };
    state.FormType = false;
  },
  setFormType(state, formType) {
    state.FormType = formType;
  },
  resetSelectedCase(state) {
    state.SelectedCase = null;
  },
  setBrand(state, brand) {
    state.Brand = brand;
  },
  setLoggedIn(state, loggedIn) {
    state.LoggedIn = loggedIn;
  },
  setSelectedCase(state, selectedCase) {
    state.SelectedCase = selectedCase;
  },
  setLanguage(state, language) {
    state.Language = language;
  },
  setAccountData(state, accountData) {
    state.AccountData.HomeAccountId = accountData.homeAccountId;
    state.AccountData.Email = accountData.username;
    state.AccountData.FirstName = accountData.idTokenClaims.given_name;
    state.AccountData.LastName = accountData.idTokenClaims.family_name;
    state.AccountData.MobileNumber = accountData.idTokenClaims.extension_TelephoneNumber;
    state.AccountData.StreetAddress = accountData.idTokenClaims.streetAddress;
    state.AccountData.City = accountData.idTokenClaims.city;
    state.AccountData.Country = accountData.idTokenClaims.country;
    state.AccountData.PostCode = accountData.idTokenClaims.postalCode;
    state.AccountData.LanguagePreference = accountData.idTokenClaims.extension_LanguagePreference;
  },
  setIFAAccount(state, accountData) {
    state.AccountData.IFA = accountData.IFA;
  },
  setReadOnlyPA(state, payload) {
    state.ReadOnlyPA = payload;
  },
  setReadOnlyDIP(state, payload) {
    state.ReadOnlyDIP = payload;
  },
  setReadOnlyDA(state, payload) {
    state.ReadOnlyDA = payload;
  },
  setReadOnlyIA(state, payload) {
    state.ReadOnlyIA = payload;
  },
  setApiHeader(state, payload) {
    state.ApiOptions.headers = payload;
  },
  setApiParams(state, payload) {
    state.ApiOptions.params = payload;
  },
};
