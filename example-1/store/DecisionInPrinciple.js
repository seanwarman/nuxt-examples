import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { dataTemplate, applicationTemplate } from "../static/dipConstants";

export const state = () => ({
  DIPData: dataTemplate,
});

export const getters = {
  DIPData: (state) => {
    return state.DIPData;
  },
  PageOffSet: (state) => {
    return state.DIPData.PageOffSet;
  },
  Applications: (state) => {
    const activeApplications = state.DIPData.Applications.filter(
      (a) => !a.Delete
    );
    return activeApplications;
  },
  MainApplicant: (state) => {
    return state.DIPData.Applications.find((a) => a.IsMainApplication);
  },
  MainApplicantHomeAddress: (state) => {
    const mainApplication = state.DIPData.Applications.find(
      (a) => a.IsMainApplication
    );
    const mainApplicantHomeAddress = mainApplication.ApplicationAddresses.find(
      (a) => a.AddressType === "Home"
    );
    const mainApplicantAddress = mainApplication.ApplicantAddress;
    if (mainApplicantHomeAddress) return mainApplicantHomeAddress.Address;
    else return mainApplicantAddress;
  },

  // Plot
  Plot_Name: (state) => {
    return state.DIPData.Plot.Name;
  },
  Plot_Plot_PlotId: (state) => {
    return state.DIPData.Plot.Plot.PlotId;
  },
  Plot_DesignType_Name: (state) => {
    return state.DIPData.Plot.DesignType.Name;
  },
  Plot_DesignType_MinCost: (state) => {
    return state.DIPData.Plot.DesignType.MinCost;
  },
  Plot_DesignType_MaxCost: (state) => {
    return state.DIPData.Plot.DesignType.MaxCost;
  },
  Plot_Plot_TotalPlotLandCost: (state) => {
    return state.DIPData.Plot.Plot.TotalPlotLandCost;
  },

  // Page-3 (ApplicantDetails2)
  ApplicantFirstName: (state) => (applicantId) => {
    const application = state.DIPData.Applications.find(
      (a) => a.Id === applicantId
    );
    if (application) return application.ApplicantFirstName;
  },
  ApplicantLastName: (state) => (applicantId) => {
    const application = state.DIPData.Applications.find(
      (a) => a.Id === applicantId
    );
    if (application) return application.ApplicantLastName;
  },
  ApplicantDateOfBirth: (state) => (applicantId) => {
    const application = state.DIPData.Applications.find(
      (a) => a.Id === applicantId
    );
    if (application) return application.ApplicantDateOfBirth;
  },
  OnlyResidentialPropertyOwned: (state) => (applicantId) => {
    const application = state.DIPData.Applications.find(
      (a) => a.Id === applicantId
    );
    if (application) {
      const currentValue = application.OnlyResidentialPropertyOwned;
      let newValue;
      if (currentValue === "Unassigned") newValue = null;
      if (currentValue === "True") newValue = true;
      if (currentValue === "False") newValue = false;
      return newValue;
    }
  },
  OnlyResidence: (state) => (applicantId) => {
    const application = state.DIPData.Applications.find(
      (a) => a.Id === applicantId
    );
    if (application) {
      const currentValue = application.OnlyResidence;
      let newValue;
      if (currentValue === "Unassigned") newValue = null;
      if (currentValue === "True") newValue = true;
      if (currentValue === "False") newValue = false;
      return newValue;
    }
  },

  // Page-4
  SuitableFundsAvailable: (state) => {
    const currentValue = state.DIPData.SuitableFundsAvailable;
    let newValue;
    if (currentValue === "Unassigned") newValue = null;
    if (currentValue === "True") newValue = true;
    if (currentValue === "False") newValue = false;
    return newValue;
  },

  // Page-6
  ApplyingForMortgage: (state) => {
    const currentValue = state.DIPData.ApplyingForMortgage;
    let newValue;
    if (currentValue === "Unassigned") newValue = null;
    if (currentValue === "True") newValue = true;
    if (currentValue === "False") newValue = false;
    return newValue;
  },
  TotalNetIncomeForMortgage: (state) => {
    return state.DIPData.TotalNetIncomeForMortgage;
  },
  IntendedBorrowing: (state) => {
    return state.DIPData.IntendedBorrowing;
  },

  // Page-7 (ApplicantSavings)
  RepayLoanWithSavings: (state) => {
    const currentValue = state.DIPData.RepayLoanWithSavings;
    let newValue;
    if (currentValue === "Unassigned") newValue = null;
    if (currentValue === "True") newValue = true;
    if (currentValue === "False") newValue = false;
    return newValue;
  },
  SavingsAmount: (state) => (applicationId) => {
    const application = state.DIPData.Applications.find(
      (a) => a.Id === applicationId
    );
    if (application) return application.SavingsAmount;
  },

  // Page-8 (ApplicantCreditConsent)
  CreditCheckConsent: (state) => (applicationId) => {
    const application = state.DIPData.Applications.find(
      (a) => a.Id === applicationId
    );
    if (application) {
      const currentValue = application.CreditCheckConsent;
      let newValue;
      if (currentValue === "Unassigned") newValue = null;
      if (currentValue === "True") newValue = true;
      if (currentValue === "False") newValue = false;
      return newValue;
    }
  },

  // Page-9 (ApplicantDataConsent)
  FundsForLoan: (state) => {
    // total savings
    const totalSavings = state.DIPData.Applications.map((a) =>
      Number(a.SavingsAmount)
    ).reduce((a, b) => a + b, 0);
    // total equity
    const properties = [];
    state.DIPData.Applications.forEach((applicant) => {
      applicant.ApplicationAddresses.forEach((address) => {
        if (address.AddressType === "Additional") {
          const AA = address.Address;
          const match = properties.find((a) => a.id === AA.Id);
          if (!match) {
            properties.push({
              id: AA.Id,
              equityToContribute: address.EquityToContribute,
            });
          }
        }
      });
    });
    const totalEquity = properties
      .map((a) => Number(a.equityToContribute))
      .reduce((a, b) => a + b, 0);
    // total borrowing
    const totalBorrowing = Number(state.DIPData.IntendedBorrowing);
    // total funds
    const fundsForLoan = totalSavings + totalEquity + totalBorrowing;
    if (fundsForLoan === 0) return "0";
    else return fundsForLoan;
  },
  DataPrivacyConsent: (state) => (applicationId) => {
    const application = state.DIPData.Applications.find(
      (a) => a.Id === applicationId
    );
    if (application) {
      const currentValue = application.DataPrivacyConsent;
      let newValue;
      if (currentValue === "Unassigned") newValue = null;
      if (currentValue === "True") newValue = true;
      if (currentValue === "False") newValue = false;
      return newValue;
    }
  },

  // page-10 (application complete)
  ApplicationReference: (state) => {
    return state.DIPData.ApplicationReference;
  },
};

export const mutations = {
  setDIPData(state, payload) {
    state.DIPData = payload;
  },
  resetDIPData(state) {
    state.DIPData = dataTemplate;
  },
  setPageOffSet(state, payload) {
    state.DIPData.PageOffSet = payload;
    state.DIPData.IsDirty = true;
  },

  // Page-2 (ApplicantDetails1)
  setApplicants(state, applicants) {
    state.DIPData.IsDirty = true;
    state.DIPData.PageOffSet = 3;
    const mainApplicant = state.DIPData.Applications.find(
      (a) => a.IsMainApplication
    );
    const mainA = mainApplicant.ApplicationAddresses.find(
      (a) => a.AddressType === "Home"
    ).Address;
    // remove deleted applicants
    state.DIPData.Applications.forEach((a) => {
      const match = applicants.find((applicant) => applicant.id === a.Id);
      if (!match && !a.IsMainApplication) a.Delete = true;
    });
    // update existing details and add new applicants
    applicants.forEach((applicant) => {
      const match = state.DIPData.Applications.find(
        (a) => a.Id === applicant.id
      );
      if (match) {
        // update existing details
        match.IsDirty = true;
        match.ApplicantFirstName = applicant.firstName;
        match.ApplicantLastName = applicant.lastName;
        match.ApplicantEmail = applicant.email;
        const matchA = match.ApplicantAddress;
        const matchHA = match.ApplicationAddresses.find(
          (a) => a.AddressType === "Home"
        );
        if (applicant.livesAtMainApplicantAddress) {
          // copy main applicants address
          matchA.Address1 = mainA.Address1;
          matchA.Address2 = mainA.Address2;
          matchA.Address3 = mainA.Address3;
          matchA.City = mainA.City;
          matchA.PostCode = mainA.PostCode;
          matchHA.Address.IsDirty = true;
          matchHA.Address.Id = mainA.Id;
          matchHA.Address.Address1 = mainA.Address1;
          matchHA.Address.Address2 = mainA.Address2;
          matchHA.Address.Address3 = mainA.Address3;
          matchHA.Address.City = mainA.City;
          matchHA.Address.PostCode = mainA.PostCode;
        } else {
          // add new address details
          matchA.Address1 = applicant.address.address1;
          matchA.Address2 = applicant.address.address2 || "";
          matchA.Address3 = applicant.address.address3 || "";
          matchA.City = applicant.address.city;
          matchA.PostCode = applicant.address.postCode;
          matchHA.Address.IsDirty = true;
          matchHA.Address.Address1 = applicant.address.address1;
          matchHA.Address.Address2 = applicant.address.address2 || "";
          matchHA.Address.Address3 = applicant.address.address3 || "";
          matchHA.Address.City = applicant.address.city;
          matchHA.Address.PostCode = applicant.address.postCode;
          // update id if previously main applicants home address
          if (matchHA.Address.Id === mainA.Id) {
            matchHA.Address.Id = uuidv4();
          }
        }
      } else {
        // create new applicant
        const newApplication = _.cloneDeep(applicationTemplate);
        const newA = newApplication.ApplicantAddress;
        const newHA = newApplication.ApplicationAddresses[0];
        newApplication.Id = uuidv4();
        newApplication.ApplicationNumber = applicant.applicationNumber;
        newApplication.ApplicantFirstName = applicant.firstName;
        newApplication.ApplicantLastName = applicant.lastName;
        newApplication.ApplicantEmail = applicant.email;
        if (applicant.livesAtMainApplicantAddress) {
          // copy main applicants address
          newA.Id = uuidv4();
          newA.Address1 = mainA.Address1;
          newA.Address2 = mainA.Address2;
          newA.Address3 = mainA.Address3;
          newA.City = mainA.City;
          newA.PostCode = mainA.PostCode;
          newHA.Id = uuidv4();
          newHA.Address.Id = mainA.Id;
          newHA.Address.Address1 = mainA.Address1;
          newHA.Address.Address2 = mainA.Address2;
          newHA.Address.Address3 = mainA.Address3;
          newHA.Address.City = mainA.City;
          newHA.Address.PostCode = mainA.PostCode;
        } else {
          // add new address
          newA.Id = uuidv4();
          newA.Address1 = applicant.address.address1;
          newA.Address2 = applicant.address.address2 || "";
          newA.Address3 = applicant.address.address3 || "";
          newA.City = applicant.address.city;
          newA.PostCode = applicant.address.postCode;
          newHA.Id = uuidv4();
          newHA.Address.Id = uuidv4();
          newHA.Address.Address1 = applicant.address.address1;
          newHA.Address.Address2 = applicant.address.address2 || "";
          newHA.Address.Address3 = applicant.address.address3 || "";
          newHA.Address.City = applicant.address.city;
          newHA.Address.PostCode = applicant.address.postCode;
        }
        state.DIPData.Applications.push(newApplication);
      }
    });
  },

  // Page-3 (ApplicantDetails2)
  setApplicantDateOfBirth(state, payload) {
    const application = state.DIPData.Applications.find(
      (a) => a.Id === payload.applicationId
    );
    if (application) {
      application.ApplicantDateOfBirth = payload.data;
      application.IsDirty = true;
    }
  },
  setOnlyResidentialPropertyOwned(state, payload) {
    const application = state.DIPData.Applications.find(
      (a) => a.Id === payload.applicationId
    );
    if (application) {
      let newValue;
      if (payload.data === null) newValue = "Unassigned";
      if (payload.data === true) newValue = "True";
      if (payload.data === false) newValue = "False";
      application.OnlyResidentialPropertyOwned = newValue;
      application.IsDirty = true;
    }
  },
  setOnlyResidence(state, payload) {
    const application = state.DIPData.Applications.find(
      (a) => a.Id === payload.applicationId
    );
    if (application) {
      let newValue;
      if (payload.data === null) newValue = "Unassigned";
      if (payload.data === true) newValue = "True";
      if (payload.data === false) newValue = "False";
      application.OnlyResidence = newValue;
      application.IsDirty = true;
    }
  },

  // Page-4
  setSuitableFundsAvailable(state, payload) {
    let newValue;
    if (payload === null) newValue = "Unassigned";
    if (payload === true) newValue = "True";
    if (payload === false) newValue = "False";
    state.DIPData.SuitableFundsAvailable = newValue;
    state.DIPData.IsDirty = true;
  },

  // Page-5 (Property Currently Owned)
  setProperties(state, properties) {
    state.DIPData.IsDirty = true;
    state.DIPData.PageOffSet = 6;
    if (properties.length) state.DIPData.RepayFromSaleOfProperty = "True";
    else state.DIPData.RepayFromSaleOfProperty = "False";
    // remove deleted properties
    state.DIPData.Applications.forEach((applicant) => {
      applicant.ApplicationAddresses.forEach((address) => {
        if (address.AddressType === "Additional") {
          const match = properties.find(
            (property) =>
              property.id === address.Address.Id &&
              property.owners.includes(applicant.Id)
          );
          if (!match) address.Delete = true;
        }
      });
    });
    // update existing properties and add new properties
    const mainApplicant = state.DIPData.Applications.find(
      (a) => a.IsMainApplication
    );
    const mainAA = mainApplicant.ApplicationAddresses.find(
      (a) => a.AddressType === "Home"
    ).Address;
    properties.forEach((property) => {
      // calculate ownership type
      let ownershipType = "SoleOwnership";
      if (property.owners.length > 1)
        ownershipType = "JointWithOtherApplicants";
      if (property.jointOwnershipWithNonApplicant)
        ownershipType = "JointWithNonApplicant";
      const PA = property.address;
      const newID = uuidv4();
      property.owners.forEach((ownerId) => {
        const matchingApplicant = state.DIPData.Applications.find(
          (applicant) => applicant.Id === ownerId
        );
        const matchingAddress = matchingApplicant.ApplicationAddresses.find(
          (address) =>
            !address.Delete &&
            address.AddressType !== "Home" &&
            address.Address.Id === property.id
        );
        if (matchingAddress) {
          // update existing address
          matchingAddress.IsDirty = true;
          matchingAddress.OutstandingMortgageAmount =
            +property.outstandingMortgageAmount;
          matchingAddress.EstimatedValue = +property.estimatedValue;
          matchingAddress.EquityToContribute = +property.equityToContribute;
          matchingAddress.OwnershipType = ownershipType;
          const MA = matchingAddress.Address;
          if (property.sellingMainApplicantAddress) {
            // copy main applicants home address if selected on form
            MA.IsDirty = true;
            MA.Id = mainAA.Id;
            MA.Address1 = mainAA.Address1;
            MA.Address2 = mainAA.Address2;
            MA.Address3 = mainAA.Address3;
            MA.City = mainAA.City;
            MA.PostCode = mainAA.PostCode;
          } else {
            // update with details entered on form
            MA.IsDirty = true;
            MA.Address1 = PA.address1;
            MA.Address2 = PA.address2;
            MA.Address3 = PA.address3;
            MA.City = PA.city;
            MA.PostCode = PA.postCode;
            // update id if previously main applicants home address
            if (MA.Id === mainAA.Id) MA.Id = newID;
          }
        } else {
          // create new address
          let newAddress;
          if (property.sellingMainApplicantAddress) {
            // copy main applicants home address if selected on form
            newAddress = {
              IsDirty: true,
              Id: mainAA.Id,
              Address1: mainAA.Address1,
              Address2: mainAA.Address2,
              Address3: mainAA.Address3,
              City: mainAA.City,
              PostCode: mainAA.PostCode,
            };
          } else {
            // add details entered on form
            newAddress = {
              IsDirty: true,
              Id: property.id,
              Address1: PA.address1,
              Address2: PA.address2,
              Address3: PA.address3,
              City: PA.city,
              PostCode: PA.postCode,
            };
          }
          matchingApplicant.ApplicationAddresses.push({
            IsDirty: true,
            Id: uuidv4(),
            AddressType: "Additional",
            OutstandingMortgageAmount: +property.outstandingMortgageAmount,
            EstimatedValue: +property.estimatedValue,
            EquityToContribute: +property.equityToContribute,
            OwnershipType: ownershipType,
            // ApplicationAddressNo: 1
            Address: newAddress,
          });
        }
      });
    });
  },

  // Page-6
  setApplyingForMortgage(state, payload) {
    let newValue;
    if (payload === null) newValue = "Unassigned";
    if (payload === true) newValue = "True";
    if (payload === false) newValue = "False";
    state.DIPData.ApplyingForMortgage = newValue;
    state.DIPData.IsDirty = true;
  },
  setTotalNetIncomeForMortgage(state, payload) {
    state.DIPData.TotalNetIncomeForMortgage = payload;
    state.DIPData.IsDirty = true;
  },
  setIntendedBorrowing(state, payload) {
    state.DIPData.IntendedBorrowing = payload;
    state.DIPData.IsDirty = true;
  },

  // Page-7 (ApplicantSavings)
  setRepayLoanWithSavings(state, payload) {
    let newValue;
    if (payload === null) newValue = "Unassigned";
    if (payload === true) newValue = "True";
    if (payload === false) newValue = "False";
    state.DIPData.RepayLoanWithSavings = newValue;
    state.DIPData.IsDirty = true;
  },
  setSavingsAmount(state, payload) {
    const application = state.DIPData.Applications.find(
      (a) => a.Id === payload.applicationId
    );
    if (application) {
      application.SavingsAmount = payload.data;
      application.IsDirty = true;
    }
  },

  // Page-8 (ApplicantCreditConsent)
  setCreditCheckConsent(state, payload) {
    const application = state.DIPData.Applications.find(
      (a) => a.Id === payload.applicationId
    );
    if (application) {
      let newValue;
      if (payload.data === null) newValue = "Unassigned";
      if (payload.data === true) newValue = "True";
      if (payload.data === false) newValue = "False";
      application.CreditCheckConsent = newValue;
      application.IsDirty = true;
    }
  },

  // Page-9 (ApplicantDataConsent)
  setDataPrivacyConsent(state, payload) {
    const application = state.DIPData.Applications.find(
      (a) => a.Id === payload.applicationId
    );
    if (application) {
      let newValue;
      if (payload.data === null) newValue = "Unassigned";
      if (payload.data === true) newValue = "True";
      if (payload.data === false) newValue = "False";
      application.DataPrivacyConsent = newValue;
      application.IsDirty = true;
    }
  },
  setSubmitted(state) {
    state.DIPData.StatusReason = "Submitted";
    state.DIPData.IsDirty = true;
  },
};
