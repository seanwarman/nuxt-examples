// TODO move this API documentation to repo readme
const InvestmentApplicationDataStructure = {
  IsDirty: false, // boolean
  ApplicationReference: null, // string
  CreatedOn: null, // string (valid date)
  Name: null, // string
  StatusReason: null, // string "Active" or "" ???
  ApplicationDate: null, // string (valid date)
  // OtherBusinessType: null, // string
  MainApplicant: null, // set on front end

  // page 2 (investment details)
  Amount: null, // number (currency)
  RepaymentTerm: null, // number
  InvestmentPurpose: null, // string "Starting a business", "Growing a business", or "Buying a business" (new title: "Purpose")
  // InvestmentDescription: null, // string
  YearsTrading: null, // number (new title: "TradingPeriodYears")
  MonthsTrading: null, // number (new title: "TradingPeriodMonths")
  IsSME: null, // boolean (new title: "BusinessIsSme")
  IsTradingInWales: null, // boolean (new title: "TradingInWales")
  IsWillingToRelocate: null, // boolean (new title: "WillingToRelocateToWales")
  IsSocialEnterprise: null, // boolean
  // OtherInvestorsApproached: null, // boolean (new title: "OtherInvestors")
  OtherInvestorsDescription: null, // string (new title: "OtherInvestorExplanation")
  RefusedFinance: null, // boolean
  RefusedFinanceDescription: null, // string (new title: "RefusedFinanceExplanation")

  // // page-3 (type of business)
  BusinessType: null, // string "Limited company", "Sole trader", "Partnership", "Company limited by guarantee", or "Limited liability partnership"
  BusinessTypeDescription: null, // string
  RegisteredNumber: null, // string (new title: "CompanyNumber")
  BusinessName: null, // string
  RegisteredOfficeAddress: {
    // new name: "CompanyAddress"
    Id: null, // string (unique)
    Address1: null, // string
    Address2: null, // string
    Address3: null, // string
    City: null, // string
    PostCode: null, // string
  },
  CompaniesHouseRegistrationNumber: null, // string (new title: "Company")
  // CompanyDetailsCorrect: null, // string "Yes, this is my business and all the details listed are correct", "This is my business but some details are not correct", or "No, this is not my business"

  // // page-4 (further business details)
  BusinessRole: null, // string (new title: "MainApplicantRole")
  TradingName: null, // string
  BusinessDescription: null, // string
  DateOfFormation: null, // string (valid date) (new title: "FormationDate")
  PhoneNumber: null, // string (valid phone number) (new title: "BusinessPhone")
  // RegisteredOfficeAddressIsMainTradingAddress: null, // boolean
  // MainTradingAddress: {
  //   Address1: null, // string
  //   Address2: null, // string
  //   Address3: null, // string
  //   City: null, // string
  //   PostCode: null, // string
  // },
  VATRegistrationNumber: null, // string (new title: "VATNumber")
  NotVatRegistered: false, // boolean (new title: "BusinessNotVatRegistered")
  Turnover: null, // number (currency)
  ProfitOrLossAfterDrawings: null, // number (currency) (new title: "ProfitLossAfterDrawings")
  NetAssets: null, // number (currency)
  JobsToBeSafeguarded: null, // number (new title: "JobsSafeguarded")
  JobsToBeCreated: null, // number (new title: "JobsCreated")
  LegalProceedingsPending: null, // boolean
  // LegalProceedingsPendingDescription: null, // string
  InArrears: null, // boolean (new title: "TaxArrears")
  // InArrearsDescription: null, // string
  // IsStartUp: null, // boolean

  // // page-5 (directors and pscs) & page-6 (other significant people)
  People: [
    {
      Id: null, // string (unique)
      Source: null, // string "CompaniesHouse" or "UserEntered"
      CompaniesHouseType: null, // string "Director" or "PSC"
      SubType: null, // string "Individual" or "Company"
      FirstName: null, // string
      LastName: null, // string
      DateOfBirth: null, // string (valid date)
      Email: null, // string (valid email)
      CompanyName: null, // string
      RegisteredNumber: null, // string
      CompanyAddress: {
        Address1: null, // string
        Address2: null, // string
        Address3: null, // string
        City: null, // string
        PostCode: null, // string
      },
      IsDirector: null, // boolean (pre-populated if source = comapnies house)
      IsNoLongerDirector: null, // boolean
      IsAuthorisedSignatory: null, // boolean
      IsShareholderOver25Percent: null, // boolean
      IsNoLongerShareholderOver25Percent: null, // boolean
      IsConnectedToShareholdersOver25Percent: null, // boolean
      ShareHolderGroup: [], // array (contains ids of connected people)
    },
  ],
};

console.log(InvestmentApplicationDataStructure);
