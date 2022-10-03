/* eslint-disable no-lonely-if */
import { v4 as uuidv4 } from "uuid";
import {
  findBooleanString,
  formatCHAPIDirectorName,
} from "../lib/globalFunctions";

export const state = () => ({
  InvestmentApplications: null,
  InvestmentApplicationData: null,
});

export const getters = {
  InvestmentApplications: (state) => {
    return state.InvestmentApplications;
  },
  InvestmentApplicationData: (state) => {
    return state.InvestmentApplicationData;
  },
};

export const mutations = {
  setInvestmentApplicationData(state, payload) {
    state.InvestmentApplicationData = payload;
  },

  // page-1 (investment applications)
  setInvestmentApplications(state, payload) {
    if (payload) {
      payload.forEach(
        (item) => (item.formattedDate = new Date(item.ApplicationDate))
      );
      const applicationsSortedByDate = payload.sort(
        (a, b) => b.formattedDate - a.formattedDate
      );
      state.InvestmentApplications = applicationsSortedByDate;
    } else {
      state.InvestmentApplications = null;
    }
  },

  // page-2 (investment details)
  setInvestmentDetails(state, payload) {
    const d = state.InvestmentApplicationData;
    d.IsDirty = true;
    d.PageNo = 3;
    // add new data
    d.Amount = +payload.amount;
    d.RepaymentTerm = +payload.repaymentTerm;
    let purpose = null;
    if (payload.purpose === "Starting a business") purpose = "StartingBusiness";
    if (payload.purpose === "Growing a business") purpose = "GrowingBusiness";
    if (payload.purpose === "Buying a business") purpose = "BuildingBusiness";
    d.Purpose = purpose;
    d.InvestmentDescription = payload.description;
    d.TradingPeriodYears = +payload.yearsTrading;
    d.TradingPeriodMonths = +payload.monthsTrading;
    d.BusinessIsSme = findBooleanString(payload.sme);
    d.TradingInWales = findBooleanString(payload.tradingInWales);
    d.WillingToRelocateToWales = findBooleanString(payload.willingToRelocate);
    d.IsSocialEnterprise = findBooleanString(payload.socialEnterprise);
    d.OtherInvestorsApproached = findBooleanString(
      payload.otherInvestorsApproached
    );
    d.OtherInvestorExplanation = payload.otherInvestorsDescription;
    d.RefusedFinance = findBooleanString(payload.refusedFinance);
    d.RefusedFinanceExplanation = payload.refusedFinanceDescription;
  },

  // page-3 (type of business)
  setTypeOfBusiness(state, payload) {
    const d = state.InvestmentApplicationData;
    d.IsDirty = true;
    d.PageNo = 4;
    let businessType = "Unassigned";
    if (payload.businessType === "Limited company")
      businessType = "LimitedCompany";
    if (payload.businessType === "Sole trader") businessType = "SoleTrader";
    if (payload.businessType === "Partnership") businessType = "Partnership";
    if (payload.businessType === "Company limited by guarantee")
      businessType = "CompanyLtdByGuarantee";
    if (payload.businessType === "Limited liability partnership")
      businessType = "LimitedLiabilityPartnership";
    if (payload.businessType === "Other") businessType = "Other";
    d.BusinessDescriptionTypeOther = payload.businessTypeOtherDescription;
    // if busines type or company number changed
    if (
      businessType !== d.BusinessType ||
      (payload.companiesHouseRegistrationNumber &&
        payload.companiesHouseRegistrationNumber !==
          d.CompaniesHouseRegistrationNumber)
    ) {
      // remove old data
      d.MainApplicantRole = null;
      d.TradingName = null;
      d.BusinessDescription = null;
      d.BusinessPhone = null;
      d.TradingAddress = {
        Address1: null,
        Address2: null,
        Address3: null,
        City: null,
        PostCode: null,
      };
      d.RegisteredOfficeIsTradingAddress = "Unassigned";
      d.VatNumber = null;
      d.Turnover = 0;
      d.ProfitLossAfterDrawings = 0;
      d.NetAssets = 0;
      d.JobsSafeguarded = 0;
      d.JobsCreated = 0;
      d.LegalProceedingsPending = "Unassigned";
      d.LegalProceedingsPendingDescription = null;
      d.TaxArrears = "Unassigned";
      d.TaxArrearsDescription = null;
      d.BusinessIsStartUp = "Unassigned";
      d.BusinessNotVatRegistered = "Unassigned";
      d.DirectorsAndShareholders.forEach((person) => {
        person.Delete = true;
        person.ShareholderGroup.forEach((group) => (group.Delete = true));
      });
      // add new data
      d.BusinessType = businessType;
      d.BusinessName = payload.businessName;
      const a = payload.registeredOfficeAddress;
      d.RegisteredAddress.Address1 = a.address1;
      d.RegisteredAddress.Address2 = a.address2;
      d.RegisteredAddress.Address3 = a.address3;
      d.RegisteredAddress.City = a.city;
      d.RegisteredAddress.PostCode = a.postCode;
      d.CompaniesHouseRegistrationNumber =
        payload.companiesHouseRegistrationNumber;
      d.FormationDate = payload.formationDate
        ? payload.formationDate
        : "0001-01-01T00:00:00Z";
      let detailsCorrect = "Unassigned";
      if (
        payload.detailsCorrect ===
        "Yes, this my business and all the details listed are correct"
      )
        detailsCorrect = "MyBusinessAllOk";
      if (
        payload.detailsCorrect ===
        "This is my business but some details are not correct"
      )
        detailsCorrect = "MyBusinessSomeNotOk";
      if (payload.detailsCorrect === "No, this is not my business")
        detailsCorrect = "NotMyBusiness";
      d.CompanyDetailsCorrect = detailsCorrect;
      // add new psc's and directors from companies house API
      payload.directors.forEach((director) => {
        if (
          director.officer_role.includes("director") &&
          !director.resigned_on
        ) {
          const isPerson = director.officer_role === "director";
          const firstName = formatCHAPIDirectorName(director.name).firstName;
          const lastName = formatCHAPIDirectorName(director.name).lastName;
          d.DirectorsAndShareholders.push({
            IsDirty: true,
            Id: uuidv4(),
            Source: "CompaniesHouse",
            PscType: "Director",
            PscSubType: isPerson ? "Individual" : "Company",
            DuplicateOfDirector: "Unassigned",
            BirthDay: 0,
            BirthMonth: isPerson ? +director.date_of_birth.month : 0,
            BirthYear: isPerson ? +director.date_of_birth.year : 0,
            UnformattedName: director.name,
            FirstName: isPerson ? firstName : null,
            LastName: isPerson ? lastName : null,
            Email: null,
            IsAuthorisedSignatory: "Unassigned",
            IsConnectedToShareholderOver25Percent: "Unassigned",
            IsDirector: "Unassigned",
            IsNoLongerDirector: "Unassigned",
            IsNoLongerShareholderOver25Percent: "Unassigned",
            IsShareholderOver25Percent: "Unassigned",
            CompanyAddress: {
              CompanyName: isPerson ? null : director.name,
              CompanyNumber: null,
              Address1: null,
              Address2: null,
              Address3: null,
              City: null,
              PostCode: null,
            },
            ShareholderGroup: [],
          });
        }
      });
      payload.pscs.forEach((psc) => {
        const isPerson =
          psc.kind === "individual-person-with-significant-control";
        d.DirectorsAndShareholders.push({
          IsDirty: true,
          Id: uuidv4(),
          Source: "CompaniesHouse",
          PscType: "Individual",
          PscSubType: isPerson ? "Individual" : "Company",
          DuplicateOfDirector: "Unassigned",
          BirthDay: 0,
          BirthMonth: isPerson ? +psc.date_of_birth.month : 0,
          BirthYear: isPerson ? +psc.date_of_birth.year : 0,
          UnformattedName: psc.name,
          FirstName: isPerson ? psc.name_elements.forename : null,
          LastName: isPerson ? psc.name_elements.surname : null,
          Email: null,
          IsAuthorisedSignatory: "Unassigned",
          IsConnectedToShareholderOver25Percent: "Unassigned",
          IsDirector: "Unassigned",
          IsNoLongerDirector: "Unassigned",
          IsNoLongerShareholderOver25Percent: "Unassigned",
          IsShareholderOver25Percent: "Unassigned",
          CompanyAddress: {
            CompanyName: isPerson ? null : psc.name,
            CompanyNumber: null,
            Address1: null,
            Address2: null,
            Address3: null,
            City: null,
            PostCode: null,
          },
          ShareholderGroup: [],
        });
      });
    }
  },

  // page-4 (further business details)
  setFurtherBusinessDetails(state, payload) {
    const d = state.InvestmentApplicationData;
    d.IsDirty = true;
    d.PageNo = 5;
    d.MainApplicantRole = payload.role;
    d.BusinessName = payload.businessName;
    d.TradingName = payload.tradingName;
    d.BusinessDescription = payload.businessDescription;
    d.FormationDate = new Date(
      +payload.dateOfFormation.year,
      +payload.dateOfFormation.month - 1,
      +payload.dateOfFormation.day,
      13
    ).toISOString();
    d.BusinessPhone = payload.phoneNumber;
    d.RegisteredOfficeIsTradingAddress = findBooleanString(
      payload.isMainTradingAddress
    );
    d.TradingAddress.Address1 = payload.mainTradingAddress.address1;
    d.TradingAddress.Address2 = payload.mainTradingAddress.address2;
    d.TradingAddress.Address3 = payload.mainTradingAddress.address3;
    d.TradingAddress.City = payload.mainTradingAddress.city;
    d.TradingAddress.PostCode = payload.mainTradingAddress.postCode;
    d.VatNumber = payload.vatRegistrationNumber;
    d.BusinessNotVatRegistered = findBooleanString(payload.notVatRegistered);
    d.Turnover = payload.turnover ? +payload.turnover : 0;
    d.ProfitLossAfterDrawings = payload.profitOrLossAfterDrawings
      ? +payload.profitOrLossAfterDrawings
      : 0;
    d.NetAssets = payload.netAssets ? +payload.netAssets : 0;
    d.JobsSafeguarded = payload.jobsToBeSafeguarded
      ? +payload.jobsToBeSafeguarded
      : 0;
    d.JobsCreated = payload.jobsToBeCreated ? +payload.jobsToBeCreated : 0;
    d.LegalProceedingsPending = findBooleanString(
      payload.legalProceedingsPending
    );
    d.LegalProceedingsPendingDescription =
      payload.legalProceedingsPendingDescription;
    d.TaxArrears = findBooleanString(payload.inArrears);
    d.TaxArrearsDescription = payload.inArrearsDescription;
    d.BusinessIsStartUp = findBooleanString(payload.startUp);
  },

  // page-5 (directors and pscs)
  setDirectorsAndPscs(state, payload) {
    const d = state.InvestmentApplicationData;
    d.IsDirty = true;
    d.PageNo = 6;
    d.DirectorsAndShareholders.forEach((person) => {
      const dirMatch = payload.directors.find(
        (director) => director.id === person.Id
      );
      const pscMatch = payload.pscs.find((psc) => psc.id === person.Id);
      const ospMatch = payload.osps.find((osp) => osp.id === person.Id);
      // delete removed people
      if (!dirMatch && !pscMatch && !ospMatch) {
        person.Delete = true;
        person.ShareholderGroup.forEach((group) => (group.Delete = true));
      }
      // update matches
      else if (dirMatch) {
        person.IsDirty = true;
        // add new values
        person.PscSubType = dirMatch.subType;
        if (dirMatch.source === "CompaniesHouse") {
          person.Email = dirMatch.email;
        } else {
          if (dirMatch.subType === "Individual") {
            person.BirthDay = +dirMatch.birthDay;
            person.BirthMonth = +dirMatch.birthMonth;
            person.BirthYear = +dirMatch.birthYear;
            person.FirstName = dirMatch.firstName;
            person.LastName = dirMatch.lastName;
            person.Email = dirMatch.email;
            // reset unused values
            person.CompanyAddress = {
              CompanyName: null,
              CompanyNumber: null,
              Address1: null,
              Address2: null,
              Address3: null,
              City: null,
              PostCode: null,
            };
          } else {
            person.CompanyAddress = {
              CompanyName: dirMatch.companyName,
              CompanyNumber: dirMatch.registeredNumber,
              Address1: dirMatch.companyAddress.address1,
              Address2: dirMatch.companyAddress.address2,
              Address3: dirMatch.companyAddress.address3,
              City: dirMatch.companyAddress.city,
              PostCode: dirMatch.companyAddress.postCode,
            };
            // reset unused values
            person.BirthDay = 0;
            person.BirthMonth = 0;
            person.BirthYear = 0;
            person.FirstName = null;
            person.LastName = null;
            person.Email = null;
          }
        }
      } else if (pscMatch) {
        person.IsDirty = true;
        // reset old values incase previously entered on page-6
        person.IsDirector = "Unassigned";
        person.IsNoLongerDirector = "Unassigned";
        person.IsAuthorisedSignatory = "Unassigned";
        person.IsShareholderOver25Percent = "Unassigned";
        person.IsNoLongerShareholderOver25Percent = "Unassigned";
        person.IsConnectedToShareholderOver25Percent = "Unassigned";
        person.ShareholderGroup.forEach((group) => (group.Delete = true));
        // add new values
        person.PscSubType = pscMatch.pscSubType;
        if (pscMatch.source === "CompaniesHouse") {
          person.Email = pscMatch.pscEmail;
          person.DuplicateOfDirector = findBooleanString(
            pscMatch.pscDuplicteOfDirector
          );
        } else {
          if (pscMatch.pscSubType === "Individual") {
            person.BirthDay = +pscMatch.pscBirthDay;
            person.BirthMonth = +pscMatch.pscBirthMonth;
            person.BirthYear = +pscMatch.pscBirthYear;
            person.FirstName = pscMatch.pscFirstName;
            person.LastName = pscMatch.pscLastName;
            person.Email = pscMatch.pscEmail;
            // reset unused values
            person.CompanyAddress = {
              CompanyName: null,
              CompanyNumber: null,
              Address1: null,
              Address2: null,
              Address3: null,
              City: null,
              PostCode: null,
            };
          } else {
            person.CompanyAddress = {
              CompanyName: pscMatch.pscCompanyName,
              CompanyNumber: pscMatch.pscRegisteredNumber,
              Address1: pscMatch.pscCompanyAddress.address1,
              Address2: pscMatch.pscCompanyAddress.address2,
              Address3: pscMatch.pscCompanyAddress.address3,
              City: pscMatch.pscCompanyAddress.city,
              PostCode: pscMatch.pscCompanyAddress.postCode,
            };
            // reset unused values
            person.BirthDay = 0;
            person.BirthMonth = 0;
            person.BirthYear = 0;
            person.FirstName = null;
            person.LastName = null;
            person.Email = null;
          }
        }
      } else if (ospMatch) {
        person.IsDirty = true;
        // reset old values incase previously entered on page-6
        person.IsDirector = "Unassigned";
        person.IsNoLongerDirector = "Unassigned";
        person.IsAuthorisedSignatory = "Unassigned";
        person.IsShareholderOver25Percent = "Unassigned";
        person.IsNoLongerShareholderOver25Percent = "Unassigned";
        person.IsConnectedToShareholderOver25Percent = "Unassigned";
        person.ShareholderGroup.forEach((group) => (group.Delete = true));
        // add new values
        person.PscSubType = ospMatch.ospSubType;
        if (ospMatch.ospSubType === "Individual") {
          person.BirthDay = +ospMatch.ospBirthDay;
          person.BirthMonth = +ospMatch.ospBirthMonth;
          person.BirthYear = +ospMatch.ospBirthYear;
          person.FirstName = ospMatch.ospFirstName;
          person.LastName = ospMatch.ospLastName;
          person.Email = ospMatch.ospEmail;
          // reset unused values
          person.CompanyAddress = {
            CompanyName: null,
            CompanyNumber: null,
            Address1: null,
            Address2: null,
            Address3: null,
            City: null,
            PostCode: null,
          };
        } else {
          person.CompanyAddress = {
            CompanyName: ospMatch.ospCompanyName,
            CompanyNumber: ospMatch.ospRegisteredNumber,
            Address1: ospMatch.ospCompanyAddress.address1,
            Address2: ospMatch.ospCompanyAddress.address2,
            Address3: ospMatch.ospCompanyAddress.address3,
            City: ospMatch.ospCompanyAddress.city,
            PostCode: ospMatch.ospCompanyAddress.postCode,
          };
          // reset unused values
          person.BirthDay = 0;
          person.BirthMonth = 0;
          person.BirthYear = 0;
          person.FirstName = null;
          person.LastName = null;
          person.Email = null;
        }
      }
    });
    // add new people
    payload.directors.forEach((director) => {
      const dirMatch = d.DirectorsAndShareholders.find(
        (person) => person.Id === director.id
      );
      if (!dirMatch) {
        d.DirectorsAndShareholders.push({
          IsDirty: true,
          Id: director.id,
          Source: director.source,
          PscType: "Director",
          PscSubType: director.subType,
          DuplicateOfDirector: "Unassigned",
          BirthDay: +director.birthDay,
          BirthMonth: +director.birthMonth,
          BirthYear: +director.birthYear,
          FirstName: director.firstName,
          LastName: director.lastName,
          Email: director.email,
          IsAuthorisedSignatory: "Unassigned",
          IsConnectedToShareholderOver25Percent: "Unassigned",
          IsDirector: "Unassigned",
          IsNoLongerDirector: "Unassigned",
          IsNoLongerShareholderOver25Percent: "Unassigned",
          IsShareholderOver25Percent: "Unassigned",
          CompanyAddress: {
            CompanyName: director.companyName,
            CompanyNumber: director.registeredNumber,
            Address1: director.companyAddress.address1,
            Address2: director.companyAddress.address2,
            Address3: director.companyAddress.address3,
            City: director.companyAddress.city,
            PostCode: director.companyAddress.postCode,
          },
          ShareholderGroup: [],
        });
      }
    });
    payload.pscs.forEach((psc) => {
      const pscMatch = d.DirectorsAndShareholders.find(
        (person) => person.Id === psc.id
      );
      if (!pscMatch) {
        d.DirectorsAndShareholders.push({
          IsDirty: true,
          Id: psc.id,
          Source: psc.source,
          PscType: "Individual",
          PscSubType: psc.pscSubType,
          DuplicateOfDirector: findBooleanString(psc.pscDuplicateOfDirector),
          BirthDay: +psc.pscBirthDay,
          BirthMonth: +psc.pscBirthMonth,
          BirthYear: +psc.pscBirthYear,
          FirstName: psc.pscFirstName,
          LastName: psc.pscLastName,
          Email: psc.pscEmail,
          IsAuthorisedSignatory: "Unassigned",
          IsConnectedToShareholderOver25Percent: "Unassigned",
          IsDirector: "Unassigned",
          IsNoLongerDirector: "Unassigned",
          IsNoLongerShareholderOver25Percent: "Unassigned",
          IsShareholderOver25Percent: "Unassigned",
          CompanyAddress: {
            CompanyName: psc.pscCompanyName,
            CompanyNumber: psc.pscRegisteredNumber,
            Address1: psc.pscCompanyAddress.address1,
            Address2: psc.pscCompanyAddress.address2,
            Address3: psc.pscCompanyAddress.address3,
            City: psc.pscCompanyAddress.city,
            PostCode: psc.pscCompanyAddress.postCode,
          },
          ShareholderGroup: [],
        });
      }
    });
    payload.osps.forEach((osp) => {
      const ospMatch = d.DirectorsAndShareholders.find(
        (person) => person.Id === osp.id
      );
      if (!ospMatch) {
        d.DirectorsAndShareholders.push({
          IsDirty: true,
          Id: osp.id,
          Source: osp.source,
          PscType: "Individual", // OtherSignificantPerson?
          PscSubType: osp.ospSubType,
          DuplicateOfDirector: "Unassigned",
          BirthDay: +osp.ospBirthDay,
          BirthMonth: +osp.ospBirthMonth,
          BirthYear: +osp.ospBirthYear,
          FirstName: osp.ospFirstName,
          LastName: osp.ospLastName,
          Email: osp.ospEmail,
          IsAuthorisedSignatory: "Unassigned",
          IsConnectedToShareholderOver25Percent: "Unassigned",
          IsDirector: "Unassigned",
          IsNoLongerDirector: "Unassigned",
          IsNoLongerShareholderOver25Percent: "Unassigned",
          IsShareholderOver25Percent: "Unassigned",
          CompanyAddress: {
            CompanyName: osp.ospCompanyName,
            CompanyNumber: osp.ospRegisteredNumber,
            Address1: osp.ospCompanyAddress.address1,
            Address2: osp.ospCompanyAddress.address2,
            Address3: osp.ospCompanyAddress.address3,
            City: osp.ospCompanyAddress.city,
            PostCode: osp.ospCompanyAddress.postCode,
          },
          ShareholderGroup: [],
        });
      }
    });
    // set anyOtherSignificantPeople flag
    d.AnyOtherSignificantPeople = findBooleanString(
      payload.anyOtherSignificantPeople
    );
  },

  // page-6 (other significant people)
  setOtherSignificantPeople(state, people) {
    function findBooleanStringCustom(boolean) {
      if (boolean) return "True";
      else return "False";
    }
    const d = state.InvestmentApplicationData;
    d.IsDirty = true;
    d.PageNo = 6;
    // remove redundant new connections
    d.DirectorsAndShareholders.forEach((person) => {
      if (person.SmallShareholderGroupOnly) {
        person.Delete = true;
        person.ShareholderGroup.forEach((group) => (group.Delete = true));
      }
    });
    // add new data and connections
    people.forEach((person) => {
      const match = d.DirectorsAndShareholders.find(
        (p) => p.Id === person.id && !p.SmallShareholderGroupOnly
      );
      // update details
      match.IsDirty = true;
      match.IsDirector = findBooleanStringCustom(person.isDirector);
      match.IsNoLongerDirector = findBooleanStringCustom(
        person.isNoLongerDirector
      );
      match.IsAuthorisedSignatory = findBooleanStringCustom(
        person.isAuthorisedSignatory
      );
      match.IsShareholderOver25Percent = findBooleanStringCustom(
        person.isShareholderOver25Percent
      );
      match.IsNoLongerShareholderOver25Percent = findBooleanStringCustom(
        person.isNoLongerShareholderOver25Percent
      );
      match.IsConnectedToShareholderOver25Percent = findBooleanStringCustom(
        person.isConnectedToShareholdersOver25Percent
      );
      // delete old shareholder group items
      match.ShareholderGroup.forEach((item) => {
        item.Delete = true;
      });
      // add new connections
      person.newConnections.forEach((nc) => {
        // create shareholder groups for new connection
        const shareholderGroups = [];
        const ncConnections = people.filter((p) =>
          p.connections.includes(nc.id)
        );
        ncConnections.forEach((ncConnection) => {
          shareholderGroups.push({
            IsDirty: true,
            Delete: false,
            Id: uuidv4(),
            To: {
              IsDirty: true,
              Id: ncConnection.id,
              Name: ncConnection.name,
              FirstName: ncConnection.firstName,
              LastName: ncConnection.lastName,
              CompanyName: ncConnection.companyName,
            },
            ApplicationReference: d.ApplicationReference,
            Name: ncConnection.name,
            FirstName: ncConnection.firstNamee,
            LastName: ncConnection.lastName,
            CompanyName: ncConnection.companyName,
          });
        });
        // add connection
        d.DirectorsAndShareholders.push({
          IsDirty: true,
          SmallShareholderGroupOnly: true,
          Id: nc.id,
          Source: "UserEntered",
          PscType: "Unassigned",
          PscSubType: nc.subType,
          DuplicateOfDirector: "Unassigned",
          BirthDay: +nc.birthDay,
          BirthMonth: +nc.birthMonth,
          BirthYear: +nc.birthYear,
          FirstName: nc.firstName,
          LastName: nc.lastName,
          Email: nc.email,
          IsAuthorisedSignatory: "Unassigned",
          IsConnectedToShareholderOver25Percent: "Unassigned",
          IsDirector: "Unassigned",
          IsNoLongerDirector: "Unassigned",
          IsNoLongerShareholderOver25Percent: "Unassigned",
          IsShareholderOver25Percent: "Unassigned",
          CompanyAddress: {
            CompanyName: nc.companyName,
            CompanyNumber: nc.registeredNumber,
            Address1: nc.companyAddress.address1,
            Address2: nc.companyAddress.address2,
            Address3: nc.companyAddress.address3,
            City: nc.companyAddress.city,
            PostCode: nc.companyAddress.postCode,
          },
          ShareholderGroup: shareholderGroups,
        });
      });
      // add shareholder group items
      if (person.connections.length) {
        person.connections.forEach((connectionId) => {
          // find connection match
          const connectionMatch = d.DirectorsAndShareholders.find(
            (c) => c.Id === connectionId
          );
          // add connection to shareholder group
          match.ShareholderGroup.push({
            IsDirty: true,
            Delete: false,
            Id: uuidv4(),
            To: {
              IsDirty: true,
              Id: connectionMatch.Id,
              Name: connectionMatch.Name || "",
              FirstName: connectionMatch.FirstName || "",
              LastName: connectionMatch.LastName || "",
              CompanyName: connectionMatch.CompanyAddress.CompanyName || "",
            },
            ApplicationReference: d.ApplicationReference,
            Name: connectionMatch.Name || "",
            FirstName: connectionMatch.FirstName || "",
            LastName: connectionMatch.LastName || "",
            CompanyName: connectionMatch.CompanyAddress.CompanyName || "",
          });
        });
      }
    });
  },
  setSubmitted(state) {
    state.InvestmentApplicationData.StatusReason = "Submitted";
    state.InvestmentApplicationData.IsDirty = true;
  },
};
