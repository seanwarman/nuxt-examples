/* eslint-disable no-lonely-if */
import { findBooleanString } from "~/lib/globalFunctions";

export const state = () => ({
  DetailedApplicationData: null,
});

export const getters = {
  DetailedApplicationData: (state) => {
    return state.DetailedApplicationData;
  },

  // shared plot values
  PlotId: (state) => {
    return state.DetailedApplicationData.Plot.PlotId;
  },
  TotalPlotLandCost: (state) => {
    return state.DetailedApplicationData.Plot.TotalPlotLandCost;
  },
  PlotDescription: (state) => {
    return state.DetailedApplicationData.Plot.PlotDescription;
  },

  // contents page (page-2)
  ApplicationReference: (state) => {
    return state.DetailedApplicationData.ApplicationReference;
  },
  SubmissionDeadline: (state) => {
    if (state.DetailedApplicationData.SubmissionDeadline) {
      const d =
        state.DetailedApplicationData.SubmissionDeadline.split(/[-.T :]/);
      const date = d[2] + "-" + d[1] + "-" + d[0];
      return date;
    }
  },
  SiteName: (state) => {
    return state.DetailedApplicationData.SiteName;
  },
  Applications: (state) => {
    const applications = _.cloneDeep(
      state.DetailedApplicationData.Applications
    );
    const sortedApplications = applications.sort(
      (a, b) => a.ApplicationNumber - b.ApplicationNumber
    );
    return sortedApplications;
  },
  SectionStatuses: (state) => {
    return state.DetailedApplicationData.SectionStatuses;
  },

  // page-4 (applicant details)
  HowManyAdults: (state) => {
    return state.DetailedApplicationData.HowManyAdults;
  },
  HowManyChildren: (state) => {
    return state.DetailedApplicationData.HowManyChildren;
  },

  // page-6 (creditors)
  CreditorItems: (state) => {
    return state.DetailedApplicationData.CreditorItems.filter(
      (item) => !item.Delete
    );
  },

  // page-7 (expenditures)
  ExpenditureItems: (state) => {
    return state.DetailedApplicationData.ExpenditureItems.filter(
      (item) => !item.Delete
    );
  },

  // page-9 (expected changes)
  ExpectedChanges: (state) => {
    return state.DetailedApplicationData.ExpectedChanges;
  },

  // page-13 (plot purchase deposit)
  PlotPurchaseDeposit: (state) => {
    return state.DetailedApplicationData.PlotPurchaseDeposit;
  },
  FundingSourceDescription: (state) => {
    return state.DetailedApplicationData.FundingSourceDescription;
  },

  // page-14 (applicant additional information)
  ApplicantRelationshipDeclaration: (state) => {
    return state.DetailedApplicationData.ApplicantRelationshipDeclaration;
  },

  // page-21 (loan summary)
  TotalUsedSavings: (state) => {
    const savings = state.DetailedApplicationData.Applications.map(
      (applicant) => Number(applicant.SavingsAmount)
    );
    return savings.reduce((a, b) => a + b, 0);
  },
  NewMortgageAmount: (state) => {
    return state.DetailedApplicationData.MortgageAmount;
  },
  TotalPropertySales: (state) => {
    const properties = [];
    state.DetailedApplicationData.Applications.forEach((applicant) => {
      applicant.ApplicationAddresses.forEach((address) => {
        const propertyIds = properties.map((property) => property.Address.Id);
        if (!propertyIds.includes(address.Address.Id)) {
          properties.push(address);
        }
      });
    });
    const totalPropertySales = properties
      .map((property) => Number(property.EquityToContribute))
      .reduce((a, b) => a + b, 0);
    return totalPropertySales;
  },
  EnoughFunding: (state) => {
    // find total used savings
    const totalUsedSavings = state.DetailedApplicationData.Applications.map(
      (applicant) => Number(applicant.SavingsAmount)
    ).reduce((a, b) => a + b, 0);

    // find total property sales
    const properties = [];
    state.DetailedApplicationData.Applications.forEach((applicant) => {
      applicant.ApplicationAddresses.forEach((address) => {
        const propertyIds = properties.map((property) => property.Address.Id);
        if (!propertyIds.includes(address.Address.Id)) {
          properties.push(address);
        }
      });
    });
    const totalPropertySales = properties
      .map((property) => Number(property.EquityToContribute))
      .reduce((a, b) => a + b, 0);

    // find new mortgage amount
    const newMortgageAmount = Number(
      state.DetailedApplicationData.MortgageAmount
    );

    // find total costs
    const buildersCostEstimate = Number(
      state.DetailedApplicationData.BuildCostEstimate
    );
    const totalOtherCosts = state.DetailedApplicationData.BuildCosts.map(
      (cost) => Number(cost.Amount)
    ).reduce((a, b) => a + b, 0);
    const remainingLandPurchaseCost =
      Number(state.DetailedApplicationData.Plot.TotalPlotLandCost) -
      Number(state.DetailedApplicationData.PlotPurchaseDeposit);
    const totalCosts =
      buildersCostEstimate + totalOtherCosts + remainingLandPurchaseCost;

    if (totalUsedSavings + totalPropertySales + newMortgageAmount < totalCosts)
      return false;
    else return true;
  },
};

export const mutations = {
  setDetailedApplicationData(state, payload) {
    state.DetailedApplicationData = payload;
  },

  updateSectionStatus(state, payload) {
    const section = state.DetailedApplicationData.SectionStatuses.find(
      (item) => item.Index === payload.pageNumber - 3
    );
    section.Complete = payload.completed;
    state.DetailedApplicationData.IsDirty = true;
  },

  // page-3 (plot priorities)
  setPlotDetails(state, payload) {
    const d = state.DetailedApplicationData;
    d.DesignType = payload.designType;
    d.DesignType.NoOfBedrooms = +payload.noOfBedrooms;
    d.IsDirty = true;
  },

  // page-4 (applicant details)
  setRelationshipStatuses(state, applicantsArray) {
    applicantsArray.forEach((applicant) => {
      const match = state.DetailedApplicationData.Applications.find(
        (application) => application.Id === applicant.id
      );
      // update RelationshipStatus
      if (applicant.relationshipStatus === null)
        match.RelationshipStatus = "Unassigned";
      else match.RelationshipStatus = applicant.relationshipStatus;
      // update ApplicantPartner
      if (applicant.partner === null) {
        if (match.ApplicantPartner !== null)
          match.ApplicantPartner.Delete = true;
      } else {
        const partner = applicantsArray.find(
          (item) => item.id === applicant.partner
        );
        match.ApplicantPartner = {
          Id: applicant.partner,
          Delete: false,
          RelationshipStatus: "RelationshipWithCoApplicant",
          FirstName: partner.firstName,
          LastName: partner.lastName,
        };
      }
      match.IsDirty = true;
    });
  },
  setHowManyAdults(state, payload) {
    state.DetailedApplicationData.HowManyAdults = payload;
    state.DetailedApplicationData.IsDirty = true;
  },
  setHowManyChildren(state, payload) {
    state.DetailedApplicationData.HowManyChildren = payload;
    state.DetailedApplicationData.IsDirty = true;
  },

  // page-5 (address history)
  setAddressHistories(state, applicantsArray) {
    applicantsArray.forEach((applicant) => {
      const matchingApplicant = state.DetailedApplicationData.Applications.find(
        (application) => application.Id === applicant.id
      );
      // remove redundant addresses
      matchingApplicant.AddressHistory.forEach((address) => {
        const match = applicant.addresses.find((a) => a.id === address.Id);
        if (!match) {
          address.Delete = true;
          address.IsDirty = true;
        }
      });
      // update values and add new addresses
      applicant.addresses.forEach((address) => {
        let from;
        const moveInMonth =
          Number(address.moveInMonth) < 10
            ? "0" + Number(address.moveInMonth)
            : Number(address.moveInMonth);
        if (!address.moveInMonth.length || !address.moveInYear.length) {
          from = "0001-01-01T00:00:00Z";
        } else {
          from = `${address.moveInYear}-${moveInMonth}-01T00:00:00Z`;
        }
        let to;
        const moveOutMonth =
          Number(address.moveOutMonth) < 10
            ? "0" + Number(address.moveOutMonth)
            : Number(address.moveOutMonth);
        if (!address.moveOutMonth.length || !address.moveOutYear.length) {
          to = "0001-01-01T00:00:00Z";
        } else {
          to = `${address.moveOutYear}-${moveOutMonth}-01T00:00:00Z`;
        }
        const matchingAddress = matchingApplicant.AddressHistory.find(
          (a) => a.Id === address.id
        );
        if (matchingAddress) {
          if (matchingAddress.IsCurrentAddress) {
            if (matchingAddress.From !== from) {
              matchingAddress.From = from;
              matchingAddress.IsDirty = true;
            }
          } else {
            if (
              matchingAddress.Address1 !== address.address.address1 ||
              matchingAddress.Address2 !== address.address.address2 ||
              matchingAddress.Address3 !== address.address.address3 ||
              matchingAddress.City !== address.address.city ||
              matchingAddress.PostCode !== address.address.postCode ||
              matchingAddress.From !== from ||
              matchingAddress.To !== to
            ) {
              matchingAddress.Address1 = address.address.address1;
              matchingAddress.Address2 = address.address.address2;
              matchingAddress.Address3 = address.address.address3;
              matchingAddress.City = address.address.city;
              matchingAddress.PostCode = address.address.postCode;
              matchingAddress.From = from;
              matchingAddress.To = to;
              matchingAddress.IsDirty = true;
            }
          }
        } else {
          matchingApplicant.AddressHistory.push({
            Id: address.id,
            SequenceNo: address.sequenceNo,
            Address1: address.address.address1,
            Address2: address.address.address2,
            Address3: address.address.address3,
            City: address.address.city,
            PostCode: address.address.postCode,
            From: from,
            To: to,
            IsDirty: true,
            Delete: false,
          });
        }
      });
    });
  },

  // page-6 (creditors)
  setCreditorItems(state, tableItems) {
    const newCeditorItems = [];
    // work out if table items are dirty, add delete flags, and add to newCeditorItems array
    tableItems.forEach((tableItem) => {
      const match = state.DetailedApplicationData.CreditorItems.find(
        (creditorItem) => creditorItem.Id === tableItem.Id
      );
      if (
        match &&
        match.Name === tableItem.Name &&
        match.AmountOutStanding === tableItem.AmountOutStanding &&
        match.MonthlyPaymentOrSpend === tableItem.MonthlyPaymentOrSpend &&
        match.Description === tableItem.Description
      ) {
        tableItem.IsDirty = false;
      } else {
        tableItem.IsDirty = true;
      }
      tableItem.Delete = false;
      newCeditorItems.push(tableItem);
    });
    // check for existing items that have now been removed
    const creditorItems = _.cloneDeep(
      state.DetailedApplicationData.CreditorItems
    );
    creditorItems.forEach((creditorItem) => {
      if (!tableItems.find((tableItem) => tableItem.Id === creditorItem.Id)) {
        creditorItem.Delete = true;
        creditorItem.IsDirty = true;
        newCeditorItems.push(creditorItem);
      }
    });
    state.DetailedApplicationData.CreditorItems = newCeditorItems;
  },

  // page-7 (expenditures)
  setExpenditureItems(state, tableItems) {
    // check for existing items that have now been removed
    state.DetailedApplicationData.ExpenditureItems.forEach((item) => {
      const match = tableItems.find((tableItem) => tableItem.Id === item.Id);
      if (!match) {
        item.Delete = true;
        item.IsDirty = true;
      }
    });
    // work out if table items are dirty, update, and add new items
    tableItems.forEach((tableItem) => {
      const match = state.DetailedApplicationData.ExpenditureItems.find(
        (expenditureItem) => expenditureItem.Id === tableItem.Id
      );
      if (match) {
        if (
          match.MonthlyTotal !== tableItem.MonthlyTotal ||
          match.Description !== tableItem.Description
        ) {
          match.MonthlyTotal = tableItem.MonthlyTotal;
          match.Description = tableItem.Description;
          match.IsDirty = true;
        }
      } else {
        state.DetailedApplicationData.ExpenditureItems.push(tableItem);
      }
    });
  },

  // page-8 (income)
  setIncomeItems(state, applicantIncomeArray) {
    // check for existing items that have now been removed
    state.DetailedApplicationData.Applications.forEach((applicant) => {
      applicant.IncomeItems.forEach((item) => {
        const matchingApplicant = applicantIncomeArray.find(
          (a) => a.Id === applicant.Id
        );
        const match = matchingApplicant.IncomeItems.find(
          (i) => i.Id === item.Id
        );
        if (!match) {
          item.Delete = true;
          item.IsDirty = true;
        }
      });
    });
    // update dirty items, add new items
    applicantIncomeArray.forEach((applicant) => {
      const applicantMatch = state.DetailedApplicationData.Applications.find(
        (application) => application.Id === applicant.Id
      );
      applicant.IncomeItems.forEach((item) => {
        const itemMatch = applicantMatch.IncomeItems.find(
          (incomeItem) => incomeItem.Id === item.Id
        );
        if (itemMatch) {
          if (
            itemMatch.MonthlyIncome !== item.MonthlyIncome ||
            itemMatch.Description !== item.Description
          ) {
            itemMatch.MonthlyIncome = item.MonthlyIncome;
            itemMatch.Description = item.Description;
            itemMatch.IsDirty = true;
            // applicantMatch.IsDirty = true;
          }
        } else {
          applicantMatch.IncomeItems.push(item);
          // applicantMatch.IsDirty = true;
        }
      });
    });
  },

  // page-9 (expected changes)
  setExpectedChanges(state, payload) {
    state.DetailedApplicationData.ExpectedChanges = payload;
    state.DetailedApplicationData.IsDirty = true;
  },

  // Page-10 (property ownership)
  setPropertyOwnership(state, propertyArray) {
    // update OwnHouse value
    if (propertyArray.length) {
      state.DetailedApplicationData.OwnHouse = "True";
    } else {
      state.DetailedApplicationData.OwnHouse = "False";
    }
    state.DetailedApplicationData.IsDirty = true;

    // remove deleted properties
    const currentPropertyIds = propertyArray.map((address) => address.Id);
    state.DetailedApplicationData.Applications.forEach((applicant) => {
      applicant.ApplicationAddresses.forEach((address) => {
        if (!currentPropertyIds.includes(address.Id)) {
          address.Delete = true;
        }
      });
    });

    propertyArray.forEach((address) => {
      // delete redundant addresses from previous owners
      state.DetailedApplicationData.Applications.forEach((applicant) => {
        const match = applicant.ApplicationAddresses.find(
          (a) => a.Id === address.Id
        );
        if (
          match &&
          address.PreviousOwners.includes(applicant.Id) &&
          !address.Owners.includes(applicant.Id)
        ) {
          match.Delete = true;
        }
      });
      // update existing addresses and add new addresses
      address.Owners.forEach((ownerId) => {
        const matchingApplicant =
          state.DetailedApplicationData.Applications.find(
            (applicant) => applicant.Id === ownerId
          );
        const matchingAddress = matchingApplicant.ApplicationAddresses.find(
          (a) => a.Id === address.Id
        );
        if (matchingAddress) {
          // update values on existing address if dirty
          if (
            matchingAddress.Address.Address1 !== address.Address.address1 ||
            matchingAddress.Address.Address2 !== address.Address.address2 ||
            matchingAddress.Address.Address3 !== address.Address.address3 ||
            matchingAddress.Address.City !== address.Address.city ||
            matchingAddress.Address.PostCode !== address.Address.postCode ||
            matchingAddress.EquityToContribute !== address.EquityToContribute ||
            matchingAddress.EstimatedValue !== address.EstimatedValue ||
            matchingAddress.OutstandingMortgageAmount !==
              address.OutstandingMortgageAmount ||
            matchingAddress.OwnershipType !== address.OwnershipType ||
            Number(matchingAddress.ProposedDateOfSale.split(/[-.T :]/)[1]) !==
              Number(address.DateOfSaleMonth) ||
            Number(matchingAddress.ProposedDateOfSale.split(/[-.T :]/)[0]) !==
              Number(address.DateOfSaleYear)
          ) {
            matchingAddress.Address.Address1 = address.Address.address1;
            matchingAddress.Address.Address2 = address.Address.address2;
            matchingAddress.Address.Address3 = address.Address.address3;
            matchingAddress.Address.City = address.Address.city;
            matchingAddress.Address.PostCode = address.Address.postCode;
            matchingAddress.EquityToContribute = address.EquityToContribute;
            matchingAddress.EstimatedValue = address.EstimatedValue;
            matchingAddress.OutstandingMortgageAmount =
              address.OutstandingMortgageAmount;
            matchingAddress.OwnershipType = address.OwnershipType;
            let dateOfSale;
            const dateOfSaleMonth =
              Number(address.DateOfSaleMonth) < 10
                ? "0" + Number(address.DateOfSaleMonth)
                : Number(address.DateOfSaleMonth);
            if (
              !address.DateOfSaleMonth.length ||
              !address.DateOfSaleYear.length
            ) {
              dateOfSale = "0001-01-01T00:00:00Z";
            } else {
              dateOfSale = `${address.DateOfSaleYear}-${dateOfSaleMonth}-01T00:00:00Z`;
            }
            matchingAddress.ProposedDateOfSale = dateOfSale;
            matchingAddress.Address.IsDirty = true;
            matchingAddress.IsDirty = true;
          }
        } else {
          // add new property to new owners
          let dateOfSale;
          const dateOfSaleMonth =
            Number(address.DateOfSaleMonth) < 10
              ? "0" + Number(address.DateOfSaleMonth)
              : Number(address.DateOfSaleMonth);
          if (
            !address.DateOfSaleMonth.length ||
            !address.DateOfSaleYear.length
          ) {
            dateOfSale = "0001-01-01T00:00:00Z";
          } else {
            dateOfSale = `${address.DateOfSaleYear}-${dateOfSaleMonth}-01T00:00:00Z`;
          }
          matchingApplicant.ApplicationAddresses.push({
            IsDirty: true,
            Delete: false,
            Id: address.Id,
            ApplicationAddressNo: address.ApplicationAddressNo,
            Address: {
              Id: address.Address.Id,
              IsDirty: true,
              Address1: address.Address.address1,
              Address2: address.Address.address2,
              Address3: address.Address.address3,
              City: address.Address.city,
              PostCode: address.Address.postCode,
            },
            AddressType: "Additional",
            EquityToContribute: address.EquityToContribute,
            EstimatedValue: address.EstimatedValue,
            OutstandingMortgageAmount: address.OutstandingMortgageAmount,
            OwnershipType: address.OwnershipType,
            ProposedDateOfSale: dateOfSale,
          });
        }
      });
    });
  },

  // page-11 (new mortgage details)
  setNewMortgageDetails(state, payload) {
    const d = state.DetailedApplicationData;
    d.UsingMortgage = findBooleanString(payload.usingMortgage);
    d.MortgageAmount = payload.newMortgageAmount;
    d.MortgageRepaymentTerm = payload.repaymentTerm;
    d.MortgagePaymentMonthlyEstimated = payload.monthlyRepayments;

    // update applicants employment details
    payload.applicantsArray.forEach((applicant) => {
      const match = d.Applications.find(
        (application) => application.Id === applicant.id
      );
      match.IsDirty = true;
      const e = match.Employer;
      const ea = applicant.employerAddress;
      e.Address1 = ea.address1;
      e.Address2 = ea.address2 || null;
      e.Address3 = ea.address3 || null;
      e.City = ea.city;
      e.PostCode = ea.postCode;
      e.EmployerName = applicant.nameOfEmployer;
      e.JobTitle = applicant.jobTitle;
      let employmentStatus;
      const es = applicant.employmentStatus;
      if (es === null) employmentStatus = "UnSelected";
      if (es === "employed") employmentStatus = "Employed";
      if (es === "not employed") employmentStatus = "NotEmployed";
      if (es === "self-employed") employmentStatus = "SelfEmployed";
      e.EmploymentStatus = employmentStatus;
      let startDate;
      const sd = applicant.startDate;
      const startDateMonth =
        Number(sd.month) < 10 ? "0" + Number(sd.month) : Number(sd.month);
      if (!sd.year.length || !sd.month.length) {
        startDate = "0001-01-01T00:00:00";
      } else {
        startDate = `${sd.year}-${startDateMonth}-01T00:00:00.000Z`;
      }
      e.EmploymentStartDate = startDate;
      const wpa = e.WorkPlaceAddress;
      const awa = applicant.workAddress;
      wpa.Address1 = awa.address1;
      wpa.Address2 = awa.address2 || null;
      wpa.Address3 = awa.address3 || null;
      wpa.City = awa.city;
      wpa.PostCode = awa.postCode;
      let workPlaceLocationType;
      const u = applicant.usualPlaceOfWork;
      if (u === null) workPlaceLocationType = "UnAssigned";
      if (u === "Fixed address") workPlaceLocationType = "FixedAddress";
      if (u === "Mobile") workPlaceLocationType = "Mobile";
      wpa.WorkPlaceLocationType = workPlaceLocationType;
    });
    d.IsDirty = true;
   
  },

  // page-12 (savings)
  setSavings(state, payload) {
    const d = state.DetailedApplicationData;
    d.UsingSavings = findBooleanString(payload.usingSavings);
    payload.applicantsArray.forEach((applicant) => {
      const match = d.Applications.find(
        (application) => application.Id === applicant.Id
      );
      if (match.SavingsAmount !== applicant.SavingsAmount) {
        match.SavingsAmount = applicant.SavingsAmount;
        match.IsDirty = true;
      }
    });
    d.IsDirty = true;
  },

  // page-13 (plot purchase deposit)
  setPlotPurchaseDeposit(state, payload) {
    state.DetailedApplicationData.PlotPurchaseDeposit = payload;
    state.DetailedApplicationData.IsDirty = true;
  },
  setFundingSourceDescription(state, payload) {
    state.DetailedApplicationData.FundingSourceDescription = payload;
    state.DetailedApplicationData.IsDirty = true;
  },

  // page-14 (applicant additional information)
  setApplicantRelationshipDeclaration(state, payload) {
    state.DetailedApplicationData.ApplicantRelationshipDeclaration = payload;
    state.DetailedApplicationData.IsDirty = true;
  },

  // page-15 (solicitor details)
  setSolicitorDetails(state, payload) {
    const s = state.DetailedApplicationData.Solicitor;
    s.CompanyName = payload.solicitorCompanyName;
    s.Address1 = payload.solicitorCompanyAddress.address1;
    s.Address2 = payload.solicitorCompanyAddress.address2 || null;
    s.Address3 = payload.solicitorCompanyAddress.address3 || null;
    s.City = payload.solicitorCompanyAddress.city;
    s.PostCode = payload.solicitorCompanyAddress.postCode;
    s.CompanyContact = payload.solicitorContactName;
    s.CompanyContactPhone = payload.solicitorContactNumber;
    s.CompanyContactEmail = payload.solicitorContactEmail;
    state.DetailedApplicationData.IsDirty = true;
  },

  // page-16 (contract admin details)
  setContractAdminDetails(state, payload) {
    const ca = state.DetailedApplicationData.ContractAdmin;
    ca.CompanyName = payload.contractAdminCompanyName;
    ca.Address1 = payload.contractAdminCompanyAddress.address1;
    ca.Address2 = payload.contractAdminCompanyAddress.address2 || null;
    ca.Address3 = payload.contractAdminCompanyAddress.address3 || null;
    ca.City = payload.contractAdminCompanyAddress.city;
    ca.PostCode = payload.contractAdminCompanyAddress.postCode;
    ca.CompanyContact = payload.contractAdminContactName;
    ca.CompanyContactPhone = payload.contractAdminContactNumber;
    ca.CompanyContactEmail = payload.contractAdminContactEmail;
    ca.Professsion =
      payload.adminRole === "Other"
        ? payload.roleDescription
        : payload.adminRole;
    state.DetailedApplicationData.IsDirty = true;
  },

  // page-17 (architect details)
  setArchitectDetails(state, payload) {
    const a = state.DetailedApplicationData.Architect;
    a.IsArchitectRequired = findBooleanString(payload.architectRequired);
    a.CompanyName = payload.architectCompanyName;
    a.Address1 = payload.architectCompanyAddress.address1;
    a.Address2 = payload.architectCompanyAddress.address2 || null;
    a.Address3 = payload.architectCompanyAddress.address3 || null;
    a.City = payload.architectCompanyAddress.city;
    a.PostCode = payload.architectCompanyAddress.postCode;
    a.CompanyContact = payload.architectContactName;
    a.CompanyContactPhone = payload.architectContactNumber;
    a.CompanyContactEmail = payload.architectContactEmail;
    state.DetailedApplicationData.IsDirty = true;
  },

  // page-18 (builder details)
  setBuilderDetails(state, payload) {
    const b = state.DetailedApplicationData.Builder;
    b.TrustMarkRegistrationNo = payload.builderTrustMarkRegistrationNumber;
    b.CompanyName = payload.builderCompanyName;
    b.Address1 = payload.builderCompanyAddress.address1;
    b.Address2 = payload.builderCompanyAddress.address2 || null;
    b.Address3 = payload.builderCompanyAddress.address3 || null;
    b.City = payload.builderCompanyAddress.city;
    b.PostCode = payload.builderCompanyAddress.postCode;
    b.CompanyContact = payload.builderContactName;
    b.CompanyContactPhone = payload.builderContactNumber;
    b.CompanyContactEmail = payload.builderContactEmail;
    state.DetailedApplicationData.IsDirty = true;
  },

  // page-21 (loan summary)
  setBuildCostEstimate(state, payload) {
    state.DetailedApplicationData.BuildCostEstimate = payload;
    state.DetailedApplicationData.IsDirty = true;
  },
  setBuildCosts(state, costsArray) {
    costsArray.forEach((cost) => {
      cost.IsDirty = true;
    });
    state.DetailedApplicationData.BuildCosts = costsArray;
    state.DetailedApplicationData.IsDirty = true;
  },
  setLoanAmount(state, payload) {
    state.DetailedApplicationData.LoanAmount = payload;
    state.DetailedApplicationData.IsDirty = true;
  },
  setSubmitted(state) {
    state.DetailedApplicationData.StatusCode = "Submitted";
    state.DetailedApplicationData.IsDirty = true;
  },
};
