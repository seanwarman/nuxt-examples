<template>
  <b-container class="p-3 dbw">
    <PageLoading v-if="loading" />
    <template v-else>
      <h1 class="font-weight-bold mb-5">Further business details</h1>

      <template v-if="companyType && scenarioType">
        <p class="font-weight-bold mb-1">Your role</p>
        <div class="mb-5">
          <b-form-invalid-feedback
            id="role-feedback"
            :state="validateState('role')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-input
            id="role"
            ref="role"
            v-model="$v.role.$model"
            :disabled="ReadOnlyIA"
            :state="validateState('role')"
            class="w-50 mb-3"
            type="text"
          />
        </div>

        <template v-if="companyType === 'registered'">
          <p class="font-weight-bold mb-1">Business name</p>
          <p class="mb-5">{{ businessName }}</p>
        </template>
        <template v-if="companyType === 'not-registered'">
          <p class="font-weight-bold mb-1">Business name</p>
          <div class="mb-5">
            <b-form-invalid-feedback
              id="businessName-feedback"
              :state="validateState('businessName')"
              class="error mb-1"
            >
              Invalid
            </b-form-invalid-feedback>
            <b-form-input
              id="businessName"
              ref="businessName"
              v-model="$v.businessName.$model"
              :disabled="ReadOnlyIA"
              :state="validateState('businessName')"
              class="w-50 mb-3"
              type="text"
            />
          </div>
        </template>

        <template>
          <p class="font-weight-bold mb-1">Trading name</p>
          <b-form-invalid-feedback
            id="tradingName-feedback"
            :state="validateState('tradingName')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-input
            id="tradingName"
            v-model="$v.tradingName.$model"
            :disabled="ReadOnlyIA"
            :state="validateState('tradingName')"
            class="w-50 mb-5"
            type="text"
          />
        </template>

        <p class="font-weight-bold mb-1">
          Give a brief description of the business
        </p>
        <div class="mb-5">
          <b-form-invalid-feedback
            id="businessDescription-feedback"
            :state="validateState('businessDescription')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-textarea
            id="businessDescription"
            ref="businessDescription"
            v-model="$v.businessDescription.$model"
            :disabled="ReadOnlyIA"
            :state="validateState('businessDescription')"
            rows="4"
            class="mb-1"
          />
        </div>

        <p class="font-weight-bold mb-1">Date of formation of the business</p>
        <template v-if="companyType === 'registered'">
          <p class="mb-5">
            {{
              `${dateOfFormation.day}-${dateOfFormation.month}-${dateOfFormation.year}`
            }}
          </p>
        </template>
        <template v-else>
          <b-form-invalid-feedback
            id="dateOfFormation-feedback"
            :state="validateState('dateOfFormation')"
            class="error mb-1"
          >
            Invalid date
          </b-form-invalid-feedback>
          <b-row
            id="dateOfFormation"
            ref="dateOfFormation"
            no-gutters
            class="mb-5"
          >
            <div class="date-field">
              <p class="mb-1">Day</p>
              <b-form-input
                v-model="$v.dateOfFormation.day.$model"
                :disabled="ReadOnlyIA"
                :state="validateNestedValue('dateOfFormation', 'day')"
                type="number"
                placeholder="dd"
              />
            </div>
            <div class="date-field">
              <p class="mb-1">Month</p>
              <b-form-input
                v-model="$v.dateOfFormation.month.$model"
                :disabled="ReadOnlyIA"
                :state="validateNestedValue('dateOfFormation', 'month')"
                type="number"
                placeholder="mm"
              />
            </div>
            <div class="date-field year">
              <p class="mb-1">Year</p>
              <b-form-input
                v-model="$v.dateOfFormation.year.$model"
                :disabled="ReadOnlyIA"
                :state="validateNestedValue('dateOfFormation', 'year')"
                type="number"
                placeholder="yyyy"
              />
            </div>
          </b-row>
        </template>

        <p class="font-weight-bold mb-1">Phone number</p>
        <div class="mb-5">
          <b-form-invalid-feedback
            id="phoneNumber-feedback"
            :state="validateState('phoneNumber')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-input
            id="phoneNumber"
            ref="phoneNumber"
            v-model="$v.phoneNumber.$model"
            :disabled="ReadOnlyIA"
            :state="validateState('phoneNumber')"
            class="w-50 mb-1"
            type="text"
          />
        </div>

        <template v-if="companyType === 'registered'">
          <div class="mb-3">
            <p class="font-weight-bold mb-1">Registered address</p>
            <p v-if="registeredAddress.address1" class="mb-2">
              <i>{{ registeredAddress.address1 }}</i>
            </p>
            <p v-if="registeredAddress.address2" class="mb-2">
              <i>{{ registeredAddress.address2 }}</i>
            </p>
            <p v-if="registeredAddress.address3" class="mb-2">
              <i>{{ registeredAddress.address3 }}</i>
            </p>
            <p v-if="registeredAddress.city" class="mb-2">
              <i>{{ registeredAddress.city }}</i>
            </p>
            <p v-if="registeredAddress.postCode" class="mb-2">
              <i>{{ registeredAddress.postCode }}</i>
            </p>
          </div>
        </template>

        <template v-if="companyType === 'registered'">
          <p class="mb-3">Is this address also your main trading address?</p>
          <div class="mb-3">
            <b-form-invalid-feedback
              id="isMainTradingAddress-feedback"
              :state="validateState('isMainTradingAddress')"
              class="error mb-1"
            >
              Invalid
            </b-form-invalid-feedback>
            <b-form-group
              id="isMainTradingAddress"
              ref="isMainTradingAddress"
              :disabled="ReadOnlyIA"
            >
              <b-form-radio
                v-model="$v.isMainTradingAddress.$model"
                :state="validateState('isMainTradingAddress')"
                :value="true"
                @change="resetAddress"
              >
                Yes
              </b-form-radio>
              <b-form-radio
                v-model="$v.isMainTradingAddress.$model"
                :state="validateState('isMainTradingAddress')"
                :value="false"
                @change="resetAddress"
              >
                No
              </b-form-radio>
            </b-form-group>
          </div>
        </template>

        <template
          v-if="
            (companyType === 'registered' && isMainTradingAddress === false) ||
            companyType !== 'registered'
          "
        >
          <p class="font-weight-bold mb-2">Main trading address</p>
          <AddressFinder
            ref="addressFinder"
            :address="mainTradingAddress"
            :disabled="ReadOnlyIA"
          />
        </template>

        <p class="font-weight-bold mb-1">VAT registration number</p>
        <div class="mb-5">
          <b-form-invalid-feedback
            id="vatRegistrationNumber-feedback"
            :state="validateState('vatRegistrationNumber')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-input-group prepend="GB" class="w-50 mb-3">
            <b-form-input
              id="vatRegistrationNumber"
              ref="vatRegistrationNumber"
              v-model="$v.vatRegistrationNumber.$model"
              :state="validateState('vatRegistrationNumber')"
              :disabled="notVatRegistered || ReadOnlyIA"
              type="text"
            />
          </b-input-group>
        </div>

        <b-form-checkbox
          :checked="notVatRegistered"
          :disabled="ReadOnlyIA"
          class="mb-5"
          @change="
            notVatRegistered = !notVatRegistered;
            vatRegistrationNumber = null;
          "
        >
          Business not VAT registered
        </b-form-checkbox>

        <p class="font-weight-bold mb-1">
          {{ scenarioType === "fast-track" ? 6 : 3 }}
          months bank statements
        </p>
        <p v-if="bankStatementsErrorMessage" class="error">
          {{ bankStatementsErrorMessage }}
        </p>
        <b-form-file
          id="bankStatements"
          v-model="bankStatements"
          :disabled="ReadOnlyIA"
          multiple
          class="mb-5 w-50"
          placeholder="Choose files..."
          drop-placeholder="Drop files here..."
          @change="bankStatementsErrorMessage = null"
        />
        <img
          v-if="bankStatementsUploading"
          class="loading-wheel"
          src="/loadingwheel3.gif"
        />

        <template v-if="scenarioType === 'fast-track'">
          <p class="font-weight-bold mb-1">Turnover</p>
          <div class="mb-5">
            <b-form-invalid-feedback
              id="turnover-feedback"
              :state="validateState('turnover')"
              class="error mb-1"
            >
              Invalid
            </b-form-invalid-feedback>
            <b-input-group prepend="£" class="mb-4 w-25">
              <b-form-input
                id="turnover"
                ref="turnover"
                v-model="$v.turnover.$model"
                :disabled="ReadOnlyIA"
                :state="validateState('turnover')"
                type="number"
              />
            </b-input-group>
          </div>

          <p class="font-weight-bold mb-1">Profit or loss after drawings</p>
          <div class="mb-5">
            <b-form-invalid-feedback
              id="profitOrLossAfterDrawings-feedback"
              :state="validateState('profitOrLossAfterDrawings')"
              class="error mb-1"
            >
              Invalid
            </b-form-invalid-feedback>
            <b-input-group prepend="£" class="mb-4 w-25">
              <b-form-input
                id="profitOrLossAfterDrawings"
                ref="profitOrLossAfterDrawings"
                v-model="$v.profitOrLossAfterDrawings.$model"
                :disabled="ReadOnlyIA"
                :state="validateState('profitOrLossAfterDrawings')"
                type="number"
              />
            </b-input-group>
          </div>

          <p class="font-weight-bold mb-1">Net assets</p>
          <div class="mb-5">
            <b-form-invalid-feedback
              id="netAssets-feedback"
              :state="validateState('netAssets')"
              class="error mb-1"
            >
              Invalid
            </b-form-invalid-feedback>
            <b-input-group prepend="£" class="mb-4 w-25">
              <b-form-input
                id="netAssets"
                ref="netAssets"
                v-model="$v.netAssets.$model"
                :disabled="ReadOnlyIA"
                :state="validateState('netAssets')"
                type="number"
              />
            </b-input-group>
          </div>
        </template>

        <p class="font-weight-bold mb-1">Jobs to be safeguarded</p>
        <div class="mb-5">
          <b-form-invalid-feedback
            id="jobsToBeSafeguarded-feedback"
            :state="validateState('jobsToBeSafeguarded')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-input-group class="mb-4 w-25">
            <b-form-input
              id="jobsToBeSafeguarded"
              ref="jobsToBeSafeguarded"
              v-model="$v.jobsToBeSafeguarded.$model"
              :disabled="ReadOnlyIA"
              :state="validateState('jobsToBeSafeguarded')"
              type="number"
            />
          </b-input-group>
        </div>

        <p class="font-weight-bold mb-1">Jobs to be created</p>
        <div class="mb-5">
          <b-form-invalid-feedback
            id="jobsToBeCreated-feedback"
            :state="validateState('jobsToBeCreated')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-input-group class="mb-4 w-25">
            <b-form-input
              id="jobsToBeCreated"
              ref="jobsToBeCreated"
              v-model="$v.jobsToBeCreated.$model"
              :disabled="ReadOnlyIA"
              :state="validateState('jobsToBeCreated')"
              type="number"
            />
          </b-input-group>
        </div>

        <p class="mb-3">
          Does the business have any legal or arbitration proceedings pending or
          threatened?
        </p>
        <div class="mb-5">
          <b-form-invalid-feedback
            id="legalProceedingsPending-feedback"
            :state="validateState('legalProceedingsPending')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-group
            id="legalProceedingsPending"
            ref="legalProceedingsPending"
            :disabled="ReadOnlyIA"
          >
            <b-form-radio
              v-model="$v.legalProceedingsPending.$model"
              :state="validateState('legalProceedingsPending')"
              :value="true"
            >
              Yes
            </b-form-radio>
            <b-form-radio
              v-model="$v.legalProceedingsPending.$model"
              :state="validateState('legalProceedingsPending')"
              :value="false"
              @change="legalProceedingsPendingDescription = null"
            >
              No
            </b-form-radio>
          </b-form-group>
        </div>

        <template v-if="legalProceedingsPending">
          <div class="mb-5">
            <p class="mb-1">Please tell us about this</p>
            <b-form-invalid-feedback
              id="legalProceedingsPendingDescription-feedback"
              :state="validateState('legalProceedingsPendingDescription')"
              class="error mb-1"
            >
              Invalid
            </b-form-invalid-feedback>
            <b-form-textarea
              id="legalProceedingsPendingDescription"
              ref="legalProceedingsPendingDescription"
              v-model="$v.legalProceedingsPendingDescription.$model"
              :disabled="ReadOnlyIA"
              :state="validateState('legalProceedingsPendingDescription')"
              rows="4"
              class="mb-1"
            />
          </div>
        </template>

        <p class="mb-3">
          Are any of the business's corporation tax, VAT, PAYE / NIC in arrears?
        </p>
        <div class="mb-5">
          <b-form-invalid-feedback
            id="inArrears-feedback"
            :state="validateState('inArrears')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-group id="inArrears" ref="inArrears" :disabled="ReadOnlyIA">
            <b-form-radio
              v-model="$v.inArrears.$model"
              :state="validateState('inArrears')"
              :value="true"
            >
              Yes
            </b-form-radio>
            <b-form-radio
              v-model="$v.inArrears.$model"
              :state="validateState('inArrears')"
              :value="false"
              @change="inArrearsDescription = null"
            >
              No
            </b-form-radio>
          </b-form-group>
        </div>

        <template v-if="inArrears">
          <div class="mb-5">
            <p class="mb-1">Please tell us about this</p>
            <b-form-invalid-feedback
              id="inArrearsDescription-feedback"
              :state="validateState('inArrearsDescription')"
              class="error mb-1"
            >
              Invalid
            </b-form-invalid-feedback>
            <b-form-textarea
              id="inArrearsDescription"
              ref="inArrearsDescription"
              v-model="$v.inArrearsDescription.$model"
              :disabled="ReadOnlyIA"
              :state="validateState('inArrearsDescription')"
              rows="4"
              class="mb-1"
            />
          </div>
        </template>

        <template v-if="scenarioType === 'micro-loan'">
          <p class="mb-3">Is this a start-up company?</p>
          <div class="mb-5">
            <b-form-invalid-feedback
              id="startUp-feedback"
              :state="validateState('startUp')"
              class="error mb-1"
            >
              Invalid
            </b-form-invalid-feedback>
            <b-form-group id="startUp" ref="startUp" :disabled="ReadOnlyIA">
              <b-form-radio
                v-model="$v.startUp.$model"
                :state="validateState('startUp')"
                :value="true"
              >
                Yes
              </b-form-radio>
              <b-form-radio
                v-model="$v.startUp.$model"
                :state="validateState('startUp')"
                :value="false"
              >
                No
              </b-form-radio>
            </b-form-group>
          </div>

          <p class="font-weight-bold mb-1">Business plan</p>
          <p v-if="businessPlanErrorMessage" class="error">
            {{ businessPlanErrorMessage }}
          </p>
          <b-form-file
            id="businessPlan"
            v-model="businessPlan"
            :disabled="ReadOnlyIA"
            class="mb-5 w-50"
            placeholder="Choose file..."
            drop-placeholder="Drop file here..."
            @change="businessPlanErrorMessage = null"
          />
          <img
            v-if="businessPlanUploading"
            class="loading-wheel"
            src="/loadingwheel3.gif"
          />
        </template>
      </template>
    </template>

    <div class="d-flex flex-column pt-5">
      <b-button
        variant="primary"
        class="align-self-start mb-3"
        :disabled="requestInProgress"
        @click="save"
      >
        {{ ReadOnlyIA ? "Continue" : "Save and continue" }}
      </b-button>
      <b-button
        variant="outline-primary"
        class="align-self-start"
        :disabled="requestInProgress"
        @click="backWithoutSaving"
      >
        {{ ReadOnlyIA ? "Back" : "Back without saving" }}
      </b-button>
    </div>
  </b-container>
</template>

<script>
import Vue from "vue";
import Vuelidate from "vuelidate";
import {
  required,
  requiredIf,
  minValue,
  maxValue,
  maxLength,
  numeric,
} from "vuelidate/lib/validators";
import {
  validateFormNew,
  validateAddress,
  isPhoneNumber,
  isDay,
  isMonth,
  isYear,
  isDateInPast,
  isWholeNumber,
} from "~/lib/validation";
import { findBoolean, findDateValue } from "~/lib/globalFunctions";
Vue.use(Vuelidate);

const validateDate = (year, month, day) => (value) => {
  month = month - 1;
  const d = new Date(year, month, day);
  if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
    return true;
  }
  return false;
};

export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      companyType: null,
      scenarioType: null,
      role: null,
      businessName: null,
      tradingName: null,
      businessDescription: null,
      dateOfFormation: {
        day: null,
        month: null,
        year: null,
      },
      phoneNumber: null,
      registeredAddress: {
        address1: null,
        address2: null,
        address3: null,
        city: null,
        postCode: null,
      },
      isMainTradingAddress: null,
      mainTradingAddress: {
        address1: null,
        address2: null,
        address3: null,
        city: null,
        postCode: null,
      },
      vatRegistrationNumber: null,
      notVatRegistered: false,
      bankStatements: null,
      bankStatementsUploading: false,
      bankStatementsErrorMessage: null,
      turnover: null,
      profitOrLossAfterDrawings: null,
      netAssets: null,
      jobsToBeSafeguarded: null,
      jobsToBeCreated: null,
      legalProceedingsPending: null,
      legalProceedingsPendingDescription: null,
      inArrears: null,
      inArrearsDescription: null,
      startUp: null,
      businessPlan: null,
      businessPlanUploading: false,
      businessPlanErrorMessage: null,
    };
  },
  computed: {
    ApiOptions: {
      get() {
        return this.$store.getters["Global/ApiOptions"];
      },
    },
    ReadOnlyIA: {
      get() {
        return this.$store.getters["Global/ReadOnlyIA"];
      },
    },
    AccountData: {
      get() {
        return this.$store.getters["Global/AccountData"];
      },
    },
    InvestmentApplicationData: {
      get() {
        return this.$store.getters[
          "InvestmentApplication/InvestmentApplicationData"
        ];
      },
    },
  },
  mounted() {
    this.isLoggedIn();
  },
  methods: {
    isLoggedIn() {
      if (!this.$store.state.Global.LoggedIn) {
        this.$router.push({
          path: "/dev-bank-wales/investment-application/page-1",
          query: {
            loggedIn: false,
            pageVisited: this.$route.path,
          },
        });
      } else {
        this.calculateScenario();
        this.mapStoreValuesToComponentState();
        this.loading = false;
      }
    },
    calculateScenario() {
      const d = this.InvestmentApplicationData;
      // find company type ('registered', 'not-registered', or 'sole-trader')
      let companyType;
      if (
        d.BusinessType === "LimitedCompany" ||
        d.BusinessType === "CompanyLtdByGuarantee" ||
        d.BusinessType === "LimitedLiabilityPartnership"
      )
        companyType = "registered";
      if (
        d.BusinessType === "Partnership" ||
        d.BusinessType === "Other" ||
        d.BusinessType === "SoleTrader"
      )
        companyType = "not-registered";
      this.companyType = companyType;
      // find scenario type ('fast-track', or 'micro-loan')
      let scenarioType;
      if (d.Amount <= 25000 && d.TradingPeriodYears >= 2)
        scenarioType = "fast-track";
      else scenarioType = "micro-loan";
      this.scenarioType = scenarioType;
    },
    mapStoreValuesToComponentState() {
      const d = this.InvestmentApplicationData;
      if (!d.BusinessName) {
        this.businessName = d.TradingName;
      } else this.businessName = d.BusinessName;
      this.registeredAddress = {
        address1: d.RegisteredAddress.Address1,
        address2: d.RegisteredAddress.Address2,
        address3: d.RegisteredAddress.Address3,
        city: d.RegisteredAddress.City,
        postCode: d.RegisteredAddress.PostCode,
      };
      // add date of formation from companies house
      if (
        d.BusinessType === "LimitedCompany" ||
        d.BusinessType === "CompanyLtdByGuarantee" ||
        d.BusinessType === "LimitedLiabilityPartnership"
      )
        this.dateOfFormation = {
          day: findDateValue(d.FormationDate, "day"),
          month: findDateValue(d.FormationDate, "month"),
          year: findDateValue(d.FormationDate, "year"),
        };
      // if previous saved data (MainApplicantRole is a required field)
      if (d.MainApplicantRole) {
        this.role = d.MainApplicantRole;
        if (!d.BusinessName) {
          this.businessName = d.TradingName;
        } else this.businessName = d.BusinessName;
        this.tradingName = d.TradingName;
        this.businessDescription = d.BusinessDescription;
        this.phoneNumber = d.BusinessPhone;
        this.dateOfFormation = {
          day: findDateValue(d.FormationDate, "day"),
          month: findDateValue(d.FormationDate, "month"),
          year: findDateValue(d.FormationDate, "year"),
        };
        this.isMainTradingAddress = findBoolean(
          d.RegisteredOfficeIsTradingAddress
        );
        this.mainTradingAddress = {
          address1: d.TradingAddress.Address1,
          address2: d.TradingAddress.Address2,
          address3: d.TradingAddress.Address3,
          city: d.TradingAddress.City,
          postCode: d.TradingAddress.PostCode,
        };
        this.vatRegistrationNumber = d.VatNumber;
        this.notVatRegistered = findBoolean(d.BusinessNotVatRegistered);
        this.turnover = d.Turnover;
        this.profitOrLossAfterDrawings = d.ProfitLossAfterDrawings;
        this.netAssets = d.NetAssets;
        this.jobsToBeSafeguarded = d.JobsSafeguarded;
        this.jobsToBeCreated = d.JobsCreated;
        this.legalProceedingsPending = findBoolean(d.LegalProceedingsPending);
        this.legalProceedingsPendingDescription =
          d.LegalProceedingsPendingDescription;
        this.inArrears = findBoolean(d.TaxArrears);
        this.inArrearsDescription = d.TaxArrearsDescription;
        this.startUp = findBoolean(d.BusinessIsStartUp);
      }
    },
    resetAddress() {
      this.mainTradingAddress = {
        address1: null,
        address2: null,
        address3: null,
        city: null,
        postCode: null,
      };
      const addressFinder = this.$refs.addressFinder;
      if (addressFinder) {
        addressFinder.address1 = "";
        addressFinder.address2 = "";
        addressFinder.address3 = "";
        addressFinder.city = "";
        addressFinder.postCode = "";
      }
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    validateNestedValue(parent, child) {
      const { $dirty, $error } = this.$v[parent][child];
      return $dirty ? !$error : null;
    },
    scrollIntoView(id) {
      document.getElementById(id).scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    },
    save() {
      if (this.ReadOnlyIA)
        this.$router.push("/dev-bank-wales/investment-application/page-5");
      else {
        this.requestInProgress = true;
        // validate form
        if (validateFormNew(this)) {
          this.requestInProgress = false;
          return;
        }
        const isAddress =
          this.companyType !== "registered" ||
          (this.companyType === "registered" &&
            this.isMainTradingAddress === false);
        if (isAddress && validateAddress(this.$refs.addressFinder)) {
          this.requestInProgress = false;
          return;
        }
        // map trading address to component state
        if (isAddress) {
          const newAddress = this.$refs.addressFinder;
          this.mainTradingAddress = {
            address1: newAddress.address1,
            address2: newAddress.address2,
            address3: newAddress.address3,
            city: newAddress.city,
            postCode: newAddress.postCode,
          };
        }

        // map data to store
        this.$store.commit(
          "InvestmentApplication/setFurtherBusinessDetails",
          this
        );
        // send store data to db
        this.$investmentApplicationUpdateService
          .$post("", this.InvestmentApplicationData, {
            params: { email: this.AccountData.Email },
          })
          .then((response) => {
            this.$store.commit(
              "InvestmentApplication/setInvestmentApplicationData",
              response
            );
            this.$router.push(`/dev-bank-wales/investment-application/page-5`);
            this.requestInProgress = false;
          })
          .catch(() => (this.requestInProgress = false));

        // upload files
        if (this.bankStatements && this.bankStatements.length > 10) {
          this.bankStatementsErrorMessage = "No more than 10 files allowed";
          this.scrollIntoView("bankStatements");
        } else {
          let bankStatementsUploaded = false;
          let businessPlanUploaded = false;
          const uploadBankStatements = new Promise((resolve, reject) => {
            if (this.bankStatements) {
              this.bankStatementsUploading = true;
              const formData = new FormData();
              this.bankStatements.forEach((file, index) => {
                formData.append("file", file);
              });
              this.$middlewareService
                .post("/server-middleware/fileUpload", formData, {
                  headers: {
                    Email: this.AccountData.Email,
                    Authorization: this.ApiOptions.headers.Authorization,
                    SingleFile: this.bankStatements.length === 1,
                    ServiceName: "Investments",
                    ApplicationReference:
                      this.InvestmentApplicationData.ApplicationReference,
                    DocumentType: "BankStatements",
                  },
                })
                .then((res) => {
                  if (res.data === "file-type-error") {
                    this.bankStatementsErrorMessage = "Incorrect file type";
                    this.scrollIntoView("bankStatements");
                  } else if (res.data === "file-size-error") {
                    this.bankStatementsErrorMessage = "Max file size is 5MB";
                    this.scrollIntoView("bankStatements");
                  } else if (res.data === "success") {
                    bankStatementsUploaded = true;
                  }
                  this.bankStatementsUploading = false;
                  resolve();
                });
            } else {
              resolve();
            }
          });
          const uploadBusinessPlan = new Promise((resolve, reject) => {
            if (this.businessPlan) {
              this.businessPlanUploading = true;
              const formData = new FormData();
              formData.append("file", this.businessPlan);
              this.$middlewareService
                .post("/server-middleware/fileUpload", formData, {
                  headers: {
                    Email: this.AccountData.Email,
                    Authorization: this.ApiOptions.headers.Authorization,
                    SingleFile: true,
                    ServiceName: "Investments",
                    ApplicationReference:
                      this.InvestmentApplicationData.ApplicationReference,
                    DocumentType: "BusinessPlan",
                  },
                })
                .then((res) => {
                  if (res.data === "file-type-error") {
                    this.businessPlanErrorMessage = "Incorrect file type";
                    this.scrollIntoView("businessPlan");
                  } else if (res.data === "file-size-error") {
                    this.businessPlanErrorMessage = "Max file size is 5MB";
                    this.scrollIntoView("businessPlan");
                  } else if (res.data === "success") {
                    businessPlanUploaded = true;
                  }
                  this.businessPlanUploading = false;
                  resolve();
                });
            } else {
              resolve();
            }
          });

          Promise.all([uploadBankStatements, uploadBusinessPlan]).then(() => {
            // if files uploaded succesfully, send form data
            if (
              (!this.bankStatements && !this.businessPlan) ||
              (this.bankStatements &&
                bankStatementsUploaded &&
                !this.businessPlan) ||
              (this.businessPlan &&
                businessPlanUploaded &&
                !this.bankStatements) ||
              (this.bankStatements &&
                bankStatementsUploaded &&
                this.businessPlan &&
                businessPlanUploaded)
            ) {
              this.sendData();
            } else {
              console.log("file upload error");
            }
          });
        }
      }
    },
    sendData() {
      // map data to store
      this.$store.commit(
        "InvestmentApplication/setFurtherBusinessDetails",
        this
      );
      // send store data to db
      this.$investmentApplicationUpdateService
        .$post("", this.InvestmentApplicationData, {
          params: { email: this.AccountData.Email },
        })
        .then((response) => {
          this.$store.commit(
            "InvestmentApplication/setInvestmentApplicationData",
            response
          );
          this.$router.push(`/dev-bank-wales/investment-application/page-5`);
        });
    },
    backWithoutSaving() {
      this.$router.push(`/dev-bank-wales/investment-application/page-3`);
    },
  },
  validations() {
    return {
      role: {
        required,
        maxLength: maxLength(500),
      },
      businessName: {
        required: requiredIf(function () {
          return this.companyType === "not-registered";
        }),
        maxLength: maxLength(500),
      },
      tradingName: {
        required: requiredIf(function () {
          return !this.businessName;
        }),
        maxLength: maxLength(500),
      },
      businessDescription: {
        required,
        maxLength: maxLength(10000),
      },
      dateOfFormation: {
        day: {
          required: requiredIf(function () {
            return this.companyType !== "registered";
          }),
          isDay,
          isDateInPast: (value, date) => {
            return isDateInPast(date);
          },
          isValidDate: validateDate(
            this.dateOfFormation.year,
            this.dateOfFormation.month,
            this.dateOfFormation.day
          ),
        },
        month: {
          required: requiredIf(function () {
            return this.companyType !== "registered";
          }),
          isMonth,
          isDateInPast: (value, date) => {
            return isDateInPast(date);
          },
          isValidDate: validateDate(
            this.dateOfFormation.year,
            this.dateOfFormation.month,
            this.dateOfFormation.day
          ),
        },
        year: {
          required: requiredIf(function () {
            return this.companyType !== "registered";
          }),
          isYear,
          isDateInPast: (value, date) => {
            return isDateInPast(date);
          },
          isValidDate: validateDate(
            this.dateOfFormation.year,
            this.dateOfFormation.month,
            this.dateOfFormation.day
          ),
        },
      },
      phoneNumber: {
        required,
        isPhoneNumber,
      },
      isMainTradingAddress: {
        required: requiredIf(function () {
          return this.companyType === "registered";
        }),
      },
      vatRegistrationNumber: {
        numeric,
        required: requiredIf(function () {
          return !this.notVatRegistered;
        }),
        isValidLength: (value, state) => {
          const valueWithSpacesRemoved = value && value.replace(/\s/g, "");
          if (
            (valueWithSpacesRemoved && valueWithSpacesRemoved.length === 9) ||
            state.notVatRegistered
          )
            return true;
          else return false;
        },
      },
      turnover: {
        required: requiredIf(function () {
          return this.scenarioType === "fast-track";
        }),
        isWholeNumber,
        minValue: (value) => {
          return this.scenarioType === "fast-track" ? value >= 0 : true;
        },
        maxValue: (value) => {
          return this.scenarioType === "fast-track" ? value <= 99999999 : true;
        },
      },
      profitOrLossAfterDrawings: {
        required: requiredIf(function () {
          return this.scenarioType === "fast-track";
        }),
        isWholeNumber,
        minValue: (value) => {
          return this.scenarioType === "fast-track" ? value >= -99999999 : true;
        },
        maxValue: (value) => {
          return this.scenarioType === "fast-track" ? value <= 99999999 : true;
        },
      },
      netAssets: {
        required: requiredIf(function () {
          return this.scenarioType === "fast-track";
        }),
        isWholeNumber,
        minValue: (value) => {
          return this.scenarioType === "fast-track" ? value >= -99999999 : true;
        },
        maxValue: (value) => {
          return this.scenarioType === "fast-track" ? value <= 99999999 : true;
        },
      },
      jobsToBeSafeguarded: {
        required,
        isWholeNumber,
        minValue: minValue(0),
        maxValue: maxValue(99999),
      },
      jobsToBeCreated: {
        required,
        isWholeNumber,
        minValue: minValue(0),
        maxValue: maxValue(99999),
      },
      legalProceedingsPending: {
        required,
      },
      legalProceedingsPendingDescription: {
        required: requiredIf(function () {
          return this.legalProceedingsPending;
        }),
        maxLength: maxLength(10000),
      },
      inArrears: {
        required,
      },
      inArrearsDescription: {
        required: requiredIf(function () {
          return this.inArrears;
        }),
        maxLength: maxLength(10000),
      },
      startUp: {
        required: requiredIf(function () {
          return this.scenarioType === "micro-loan";
        }),
      },
    };
  },
};
</script>

<style lang="scss">
.date-field {
  margin-right: 20px;
  width: 100px;
  &.year {
    width: 130px;
  }
}

.input-group {
  .form-control {
    &:disabled {
      background-image: none;
    }
  }
}
</style>
