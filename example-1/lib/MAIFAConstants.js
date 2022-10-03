import $config from "../nuxt.config";

export const independentFinancialAdviserAPI = {
  getDataUrl: `${$config.b2cEnv}`,
  postDataURL: `${self.$config.ifaRegistrationPostUri}`,
  dbHeaders: {
    headers: {
      "Ocp-Apim-Subscription-Key": "c5511a6b5336408d8352aa7f9b327ef9",
    },
  },
  addressLookupHeaders: {
    headers: { "x-api-key": `${self.$config.addressApiToken}` },
  },
};

export const dataTemplate = {
  IsDirty: true,
  FcaNumber: "",
  Ifas: [
    {
      Id: "",
      IsDirty: true,
      IfaNumber: "",
      Email: "",
      IsRegistered: true,
    },
  ],
  Id: "",
  CreatedOn: "",
  CompanyName: "",
  WebSiteUrl: "",
  Address: {
    Id: "",
    CreatedOn: "",
    Address1: "",
    Address2: "",
    Address3: "",
    City: "",
    County: null,
    PostCode: "",
  },
};

export const AddressTemplate = {
  Id: "",
  IsDirty: true,
  Address1: "",
  Address2: "",
  Address3: "",
  City: "",
  PostCode: "",
  County: "",
};
