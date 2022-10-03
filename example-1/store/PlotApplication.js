import { dataTemplate } from "../static/plotApplicationConstants";

export const state = () => ({
  PlotApplicationData: dataTemplate,
});

export const getters = {
  AuthHeader: (state) => {
    return state.AuthHeader;
  },
  PlotApplicationData: (state) => {
    return state.PlotApplicationData;
  },

  ApplicantFirstName: (state) => {
    return state.PlotApplicationData.ApplicantFirstName;
  },
  ApplicantLastName: (state) => {
    return state.PlotApplicationData.ApplicantLastName;
  },

  Site: (state) => {
    const city = state.PlotApplicationData.Plot.Address.City;
    const postCode = state.PlotApplicationData.Plot.Address.PostCode;
    return `${city}, ${postCode}`;
  },
  PlotId: (state) => {
    return state.PlotApplicationData.Plot.PlotId;
  },
  PlotDescription: (state) => {
    return state.PlotApplicationData.Plot.PlotDescription;
  },
  TotalPlotLandCost: (state) => {
    return state.PlotApplicationData.Plot.TotalPlotLandCost;
  },
  BuildingDesignTypes: (state) => {
    return state.PlotApplicationData.BuildingDesignTypes;
  },
  HowManyAdults: (state) => {
    return state.PlotApplicationData.HowManyAdults;
  },
  HowManyChildren: (state) => {
    return state.PlotApplicationData.HowManyChildren;
  },
  OwnHouse: (state) => {
    const currentValue = state.PlotApplicationData.OwnHouse;
    let newValue;
    if (currentValue === "Unassigned") newValue = null;
    if (currentValue === "True") newValue = true;
    if (currentValue === "False") newValue = false;
    return newValue;
  },
  PlotPriorities: (state) => {
    return state.PlotApplicationData.Plot.PlotPriorities;
  },
  SupportingInformation: (state) => {
    return state.PlotApplicationData.SupportingInformation;
  },
  AdditionalDesignRequirements: (state) => {
    return state.PlotApplicationData.AdditionalDesignRequirements;
  },
  ReadAndUnderstandPlotCriteria: (state) => {
    const currentValue =
      state.PlotApplicationData.ReadAndUnderstandPlotCriteria;
    let newValue;
    if (currentValue === "Unassigned") newValue = null;
    if (currentValue === "True") newValue = true;
    if (currentValue === "False") newValue = false;
    return newValue;
  },
  AcceptEstimatedCosts: (state) => {
    const currentValue = state.PlotApplicationData.AcceptEstimatedCosts;
    let newValue;
    if (currentValue === "Unassigned") newValue = null;
    if (currentValue === "True") newValue = true;
    if (currentValue === "False") newValue = false;
    return newValue;
  },
};

export const mutations = {
  setAuthHeader(state, payload) {
    state.AuthHeader = payload;
  },
  setPlotApplicationData(state, payload) {
    state.PlotApplicationData = payload;
  },
  // resetPlotApplicationData(state) {
  //     state.PlotApplicationData = {};
  // },
  setSelectedDesignType(state, payload) {
    const selectedDesignType =
      state.PlotApplicationData.BuildingDesignTypes.find(
        (item) => item.PlotDesign.Id === payload
      ).PlotDesign;
    state.PlotApplicationData.DesignType = selectedDesignType;
    state.PlotApplicationData.IsDirty = true;
  },
  setHowManyAdults(state, payload) {
    state.PlotApplicationData.HowManyAdults = payload;
    state.PlotApplicationData.IsDirty = true;
  },
  setHowManyChildren(state, payload) {
    state.PlotApplicationData.HowManyChildren = payload;
    state.PlotApplicationData.IsDirty = true;
  },
  setOwnHouse(state, payload) {
    let newValue;
    if (payload === null) newValue = "Unassigned";
    if (payload === true) newValue = "True";
    if (payload === false) newValue = "False";
    state.PlotApplicationData.OwnHouse = newValue;
    state.PlotApplicationData.IsDirty = true;
  },
  setSupportingInformation(state, payload) {
    state.PlotApplicationData.SupportingInformation = payload;
    state.PlotApplicationData.IsDirty = true;
  },
  setAdditionalDesignRequirements(state, payload) {
    state.PlotApplicationData.AdditionalDesignRequirements = payload;
    state.PlotApplicationData.IsDirty = true;
  },
  setReadAndUnderstandPlotCriteria(state, payload) {
    let newValue;
    if (payload === null) newValue = "Unassigned";
    if (payload === true) newValue = "True";
    if (payload === false) newValue = "False";
    state.PlotApplicationData.ReadAndUnderstandPlotCriteria = newValue;
    state.PlotApplicationData.IsDirty = true;
  },
  setAcceptEstimatedCosts(state, payload) {
    let newValue;
    if (payload === null) newValue = "Unassigned";
    if (payload === true) newValue = "True";
    if (payload === false) newValue = "False";
    state.PlotApplicationData.AcceptEstimatedCosts = newValue;
    state.PlotApplicationData.IsDirty = true;
  },
};
