export const dataTemplate = {
  IsDirty: true,
  AcceptEstimatedCosts: true,
  Applicant: {},
  ApplicantAddress: {},
  ApplicantFirstName: "",
  ApplicantLastName: "",
  ApplicantMiddleName: "",
  BuildingDesignTypes: [
    {
      IsDirty: false,
      IsSelected: false,
      PlotDesignType: {
        BuildCost: 0,
        DesignType: {
          Id: "",
          IsDirty: false,
          MaxCost: 0,
          MinCost: 0,
          Name: "",
        },
        Plot: {
          Address: {},
          Id: "",
          IsDirty: false,
          Name: "",
          PlotId: null,
          TotalPlotLandCost: 0,
        },
      },
    },
  ],
  HowManyAdults: 1,
  HowManyChildren: 1,
  PersonalDataConsent: true,
  Plot: {
    PlotId: null,
    TotalPlotLandCost: 0,
  },
  PlotPriorities: "",
  ReadAndUnderstandPlotCriteria: false,
  SupportingInformation: null,

  // OwnHouse: false,
  // AdditionalDesignRequirements: '',
};
