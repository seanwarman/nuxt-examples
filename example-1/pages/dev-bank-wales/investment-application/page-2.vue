<template>
  <b-container class="p-3 dbw">
    <PageLoading v-if="loading" />
    <template v-else>
      <h1 class="font-weight-bold mb-5">Investment details</h1>

      <p class="font-weight-bold mb-1">Amount</p>
      <div class="mb-5">
        <b-form-invalid-feedback
          id="amount-feedback"
          :state="validateState('amount')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-input-group prepend="£" class="mb-4 w-25">
          <b-form-input
            id="amount"
            ref="amount"
            v-model="$v.amount.$model"
            :disabled="ReadOnlyIA"
            :state="validateState('amount')"
            type="number"
          />
        </b-input-group>
      </div>

      <p class="font-weight-bold mb-1">Repayment term (Years)</p>
      <div class="mb-5">
        <b-form-invalid-feedback
          id="repaymentTerm-feedback"
          :state="validateState('repaymentTerm')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-input-group class="mb-4 w-25">
          <b-form-input
            id="repaymentTerm"
            ref="repaymentTerm"
            v-model="$v.repaymentTerm.$model"
            :disabled="ReadOnlyIA"
            :state="validateState('repaymentTerm')"
            type="number"
          />
        </b-input-group>
      </div>

      <p class="font-weight-bold mb-1">Purpose</p>
      <div class="mb-5">
        <b-form-group id="purpose" ref="purpose" class="w-100">
          <b-form-invalid-feedback
            id="purpose-feedback"
            :state="validateState('purpose')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-radio
            v-for="(option, index) in purposeOptions"
            :key="index"
            v-model="$v.purpose.$model"
            :disabled="ReadOnlyIA"
            :state="validateState('purpose')"
            :value="option"
          >
            {{ option }}
          </b-form-radio>
        </b-form-group>
      </div>

      <p class="font-weight-bold mb-1">
        Describe what the investment will be used for
      </p>
      <div class="mb-5">
        <b-form-invalid-feedback
          id="description-feedback"
          :state="validateState('description')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-textarea
          id="description"
          ref="description"
          v-model="$v.description.$model"
          :disabled="ReadOnlyIA"
          :state="validateState('description')"
          rows="4"
          class="mb-1"
        />
      </div>

      <p class="font-weight-bold mb-1">Time trading</p>
      <div class="mb-5">
        <b-form-invalid-feedback
          id="yearsTrading-feedback"
          :state="validateState('yearsTrading')"
          class="error mb-1"
        >
          Invalid years
        </b-form-invalid-feedback>
        <b-form-invalid-feedback
          id="monthsTrading-feedback"
          :state="validateState('monthsTrading')"
          class="error mb-1"
        >
          Invalid months
        </b-form-invalid-feedback>
        <b-row no-gutters class="mb-3">
          <b-col cols="2" class="mr-2">
            <p class="mb-1">Years</p>
            <b-form-input
              id="yearsTrading"
              ref="yearsTrading"
              v-model="$v.yearsTrading.$model"
              :disabled="ReadOnlyIA"
              :state="validateState('yearsTrading')"
              type="number"
              placeholder="years"
            />
          </b-col>
          <b-col cols="2">
            <p class="mb-1">Months</p>
            <b-form-input
              id="monthsTrading"
              ref="monthsTrading"
              v-model="$v.monthsTrading.$model"
              :disabled="ReadOnlyIA"
              :state="validateState('monthsTrading')"
              type="number"
              placeholder="months"
            />
          </b-col>
        </b-row>
      </div>

      <p class="mb-3">Is your business an SME?</p>
      <div class="mb-5">
        <b-form-invalid-feedback
          id="sme-feedback"
          :state="validateState('sme')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-group id="sme" ref="sme" :disabled="ReadOnlyIA">
          <b-form-radio
            v-model="$v.sme.$model"
            :state="validateState('sme')"
            :value="true"
          >
            Yes
          </b-form-radio>
          <b-form-radio
            v-model="$v.sme.$model"
            :state="validateState('sme')"
            :value="false"
          >
            No
          </b-form-radio>
        </b-form-group>
      </div>

      <p class="mb-3">Is a material part of your business trading in Wales?</p>
      <div class="mb-5">
        <b-form-invalid-feedback
          id="tradingInWales-feedback"
          :state="validateState('tradingInWales')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-group
          id="tradingInWales"
          ref="tradingInWales"
          :disabled="ReadOnlyIA"
        >
          <b-form-radio
            v-model="$v.tradingInWales.$model"
            :state="validateState('tradingInWales')"
            :value="true"
            @change="willingToRelocate = null"
          >
            Yes
          </b-form-radio>
          <b-form-radio
            v-model="$v.tradingInWales.$model"
            :state="validateState('tradingInWales')"
            :value="false"
          >
            No
          </b-form-radio>
        </b-form-group>
      </div>

      <template v-if="tradingInWales === false">
        <p class="mb-3">
          Are you willing to relocate a material part of your business to Wales?
        </p>
        <div class="mb-5">
          <b-form-invalid-feedback
            id="willingToRelocate-feedback"
            :state="validateState('willingToRelocate')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-group
            id="willingToRelocate"
            ref="willingToRelocate"
            :disabled="ReadOnlyIA"
          >
            <b-form-radio
              v-model="$v.willingToRelocate.$model"
              :state="validateState('willingToRelocate')"
              :value="true"
            >
              Yes
            </b-form-radio>
            <b-form-radio
              v-model="$v.willingToRelocate.$model"
              :state="validateState('willingToRelocate')"
              :value="false"
            >
              No
            </b-form-radio>
          </b-form-group>
          <template v-if="willingToRelocate === false">
            <p class="error">Unable to continue</p>
          </template>
        </div>
      </template>

      <p class="mb-3">Is this a Social Enterprise?</p>
      <div class="mb-5">
        <b-form-invalid-feedback
          id="socialEnterprise-feedback"
          :state="validateState('socialEnterprise')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-group
          id="socialEnterprise"
          ref="socialEnterprise"
          :disabled="ReadOnlyIA"
        >
          <b-form-radio
            v-model="$v.socialEnterprise.$model"
            :state="validateState('socialEnterprise')"
            :value="true"
          >
            Yes
          </b-form-radio>
          <b-form-radio
            v-model="$v.socialEnterprise.$model"
            :state="validateState('socialEnterprise')"
            :value="false"
          >
            No
          </b-form-radio>
        </b-form-group>
        <template v-if="socialEnterprise === true && amount <= 50000">
          <p class="error">
            Unable to continue. Amount entered less than or equal to £50K
          </p>
        </template>
      </div>

      <p class="mb-3">
        Has the business approached any other investor(s) to finance this
        project?
      </p>
      <div class="mb-5">
        <b-form-invalid-feedback
          id="otherInvestorsApproached-feedback"
          :state="validateState('otherInvestorsApproached')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-group
          id="otherInvestorsApproached"
          ref="otherInvestorsApproached"
          :disabled="ReadOnlyIA"
        >
          <b-form-radio
            v-model="$v.otherInvestorsApproached.$model"
            :state="validateState('otherInvestorsApproached')"
            :value="true"
          >
            Yes
          </b-form-radio>
          <b-form-radio
            v-model="$v.otherInvestorsApproached.$model"
            :state="validateState('otherInvestorsApproached')"
            :value="false"
            @change="otherInvestorsDescription = null"
          >
            No
          </b-form-radio>
        </b-form-group>
      </div>

      <template v-if="otherInvestorsApproached === true">
        <div class="mb-5">
          <p class="mb-1">Please tell us about this</p>
          <b-form-invalid-feedback
            id="otherInvestorsDescription-feedback"
            :state="validateState('otherInvestorsDescription')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-textarea
            id="otherInvestorsDescription"
            ref="otherInvestorsDescription"
            v-model="$v.otherInvestorsDescription.$model"
            :disabled="ReadOnlyIA"
            :state="validateState('otherInvestorsDescription')"
            rows="4"
            class="mb-1"
          />
        </div>
      </template>

      <p class="mb-3">
        Has the business ever been refused finance for this project?
      </p>
      <div class="mb-5">
        <b-form-invalid-feedback
          id="refusedFinance-feedback"
          :state="validateState('refusedFinance')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-group
          id="refusedFinance"
          ref="refusedFinance"
          :disabled="ReadOnlyIA"
        >
          <b-form-radio
            v-model="$v.refusedFinance.$model"
            :state="validateState('refusedFinance')"
            :value="true"
          >
            Yes
          </b-form-radio>
          <b-form-radio
            v-model="$v.refusedFinance.$model"
            :state="validateState('refusedFinance')"
            :value="false"
            @change="refusedFinanceDescription = null"
          >
            No
          </b-form-radio>
        </b-form-group>
      </div>

      <template v-if="refusedFinance === true">
        <div class="mb-5">
          <p class="mb-1">Please tell us about this</p>
          <b-form-invalid-feedback
            id="refusedFinanceDescription-feedback"
            :state="validateState('refusedFinanceDescription')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-textarea
            id="refusedFinanceDescription"
            ref="refusedFinanceDescription"
            v-model="$v.refusedFinanceDescription.$model"
            :disabled="ReadOnlyIA"
            :state="validateState('refusedFinanceDescription')"
            rows="4"
            class="mb-1"
          />
        </div>
      </template>

      <div class="d-flex flex-column pt-5">
        <b-button
          variant="primary"
          class="align-self-start mb-3"
          :disabled="
            (tradingInWales === false && willingToRelocate === false) ||
            (socialEnterprise === true && amount <= 50000) ||
            requestInProgress
          "
          @click="save"
        >
          {{ ReadOnlyIA ? "Continue" : "Save and continue" }}
        </b-button>
        <b-button
          v-if="!$store.state.Global.FormType"
          variant="outline-primary"
          class="align-self-start"
          :disabled="requestInProgress"
          @click="backWithoutSaving"
        >
          {{ ReadOnlyIA ? "Back" : "Back without saving" }}
        </b-button>
      </div>
    </template>
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
} from "vuelidate/lib/validators";
import { validateFormNew, isWholeNumber } from "~/lib/validation";
import { findBoolean } from "~/lib/globalFunctions";
Vue.use(Vuelidate);
export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      amount: null,
      repaymentTerm: null,
      purpose: null,
      purposeOptions: [
        "Starting a business",
        "Growing a business",
        "Buying a business",
      ],
      description: null,
      yearsTrading: null,
      monthsTrading: null,
      sme: null,
      tradingInWales: null,
      willingToRelocate: null,
      socialEnterprise: null,
      otherInvestorsApproached: null,
      otherInvestorsDescription: null,
      refusedFinance: null,
      refusedFinanceDescription: null,
    };
  },
  computed: {
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
            newForm: this.$route.query.formType,
          },
        });
      } else if (this.$route.query.formType) {
        this.startNewApplication();
      } else if (!this.$route.query.formType) {
        this.mapStoreValuesToComponentState();
        this.loading = false;
      }
    },

    startNewApplication() {
      this.loading = true;
      this.$investmentApplicationCreateService
        .$post("", null, { params: { email: this.AccountData.Email } })
        .then((response) => {
          this.$store.commit(
            "InvestmentApplication/setInvestmentApplicationData",
            response
          );
          this.mapStoreValuesToComponentState();
          this.loading = false;
        });
    },

    mapStoreValuesToComponentState() {
      const d = this.InvestmentApplicationData;
      if (d.InvestmentDescription) {
        // if previous saved data (InvestmentDescription is a required field)
        this.amount = d.Amount;
        this.repaymentTerm = d.RepaymentTerm;
        let purpose = null;
        if (d.Purpose === "StartingBusiness") purpose = "Starting a business";
        if (d.Purpose === "GrowingBusiness") purpose = "Growing a business";
        if (d.Purpose === "BuildingBusiness") purpose = "Buying a business";
        this.purpose = purpose;
        this.description = d.InvestmentDescription;
        this.yearsTrading = d.TradingPeriodYears;
        this.monthsTrading = d.TradingPeriodMonths;
        this.sme = findBoolean(d.BusinessIsSme);
        this.tradingInWales = findBoolean(d.TradingInWales);
        this.willingToRelocate = findBoolean(d.WillingToRelocateToWales);
        this.socialEnterprise = findBoolean(d.IsSocialEnterprise);
        this.otherInvestorsApproached = findBoolean(d.OtherInvestorsApproached);
        this.otherInvestorsDescription = d.OtherInvestorExplanation;
        this.refusedFinance = findBoolean(d.RefusedFinance);
        this.refusedFinanceDescription = d.RefusedFinanceExplanation;
      }
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    save() {
      if (this.ReadOnlyIA)
        this.$router.push("/dev-bank-wales/investment-application/page-3");
      else {
        this.requestInProgress = true;
        // validate form
        if (validateFormNew(this)) {
          this.requestInProgress = false;
          return;
        }
        // map data to store
        this.$store.commit("InvestmentApplication/setInvestmentDetails", this);
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
            this.$router.push(`/dev-bank-wales/investment-application/page-3`);
            this.requestInProgress = false;
          })
          .catch(() => (this.requestInProgress = false));
      }
    },
    backWithoutSaving() {
      this.$router.push(`/dev-bank-wales/investment-application/page-1`);
    },
  },
  validations: {
    amount: {
      required,
      isWholeNumber,
      minValue: minValue(0),
    },
    repaymentTerm: {
      required,
      isWholeNumber,
      minValue: minValue(1),
      maxValue: maxValue(24),
    },
    purpose: {
      required,
    },
    description: {
      required,
      maxLength: maxLength(10000),
    },
    yearsTrading: {
      required,
      isWholeNumber,
      minValue: minValue(0),
      maxValue: maxValue(9999),
    },
    monthsTrading: {
      required,
      isWholeNumber,
      minValue: minValue(0),
      maxValue: maxValue(11),
    },
    sme: {
      required,
    },
    tradingInWales: {
      required,
    },
    willingToRelocate: {
      required: requiredIf(function () {
        return this.tradingInWales === false;
      }),
    },
    socialEnterprise: {
      required,
    },
    otherInvestorsApproached: {
      required,
    },
    otherInvestorsDescription: {
      required: requiredIf(function () {
        return this.otherInvestorsApproached === true;
      }),
      maxLength: maxLength(10000),
    },
    refusedFinance: {
      required,
    },
    refusedFinanceDescription: {
      required: requiredIf(function () {
        return this.refusedFinance === true;
      }),
      maxLength: maxLength(10000),
    },
  },
};
</script>

<style lang="scss"></style>
