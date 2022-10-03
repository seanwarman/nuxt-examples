<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <template v-else>
      <h1 class="font-weight-bold mb-3">New mortgage</h1>
      <p class="mb-3">
        Do you intend to apply for a new mortgage to finance the Self Build
        Wales loan?
      </p>
      <b-form-group class="mb-5">
        <b-form-invalid-feedback
          id="mortage-financing-loan-group-feedback"
          class="error mb-2"
          :state="validateState('ApplyingForMortgage')"
        >
          Please select if you intend to apply for a new mortgage to finance the
          Self Build Wales loan
        </b-form-invalid-feedback>
        <b-form-radio-group
          id="mortage-financing-loan-group"
          ref="ApplyingForMortgage"
          v-model="$v.ApplyingForMortgage.$model"
          :disabled="ReadOnlyDIP"
          stacked
          name="mortage-financing-loan-group"
          aria-describedby="mortage-financing-loan-group-feedback"
        >
          <b-form-radio name="mortage-financing-loan" :value="true">
            Yes
          </b-form-radio>
          <b-form-radio
            name="mortage-financing-loan"
            :value="false"
            @change="resetValues"
          >
            No
          </b-form-radio>
        </b-form-radio-group>
      </b-form-group>

      <template v-if="ApplyingForMortgage">
        <h3 class="font-weight-bold mb-3">Net income calculation</h3>
        <p class="mb-3">
          Your net income is the amount of total income after taking away
          essential spending. This is the maximum amount available for you to
          repay your mortgage each month.
        </p>
        <p class="mb-3">
          You need to provide an accurate figure for the household monthly net
          income available to repay the new mortgage.
        </p>
        <p class="mb-5">
          To help you do this download the
          <a
            href="https://developmentbankwales.sharepoint.com/:x:/r/sites/DTDocuments/Documents/SBW/SBW%20Affordability%20Calculator%20inc%20Mort%20Calc.xlsx?d=w9869af6b25d2469e8617a8a279fb85fc&csf=1&web=1&e=1PxWx4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Self Build Wales Net Income Calculator
            <span class="sr-only">
              Please note: This link will open a new tab in your browser
            </span> </a
          >.
        </p>
        <p class="font-weight-bold mb-0">Monthly net income</p>
        <label for="total-net-income"
          >What is your monthly net income? Give the total net income from all
          applicants.</label
        >
        <b-form-invalid-feedback
          id="total-net-income-feedback"
          class="error mb-2"
          :state="validateState('TotalNetIncomeForMortgage')"
        >
          Please provide a valid amount for your monthly net income
        </b-form-invalid-feedback>
        <b-row>
          <b-col md="6" lg="4" class="mb-3">
            <b-input-group prepend="£">
              <b-form-input
                id="total-net-income"
                ref="TotalNetIncomeForMortgage"
                v-model="TotalNetIncomeForMortgage"
                :disabled="ReadOnlyDIP"
                type="number"
              ></b-form-input>
            </b-input-group>
          </b-col>
        </b-row>

        <p class="font-weight-bold mb-0">New mortgage amount</p>
        <label for="borrowing-amount"
          >How much do you intend to borrow under the new mortgage?</label
        >
        <b-form-invalid-feedback
          id="borrowing-amount-feedback"
          class="error mb-2"
          :state="validateState('IntendedBorrowing')"
        >
          Please provide a valid amount you intend to borrow under the new
          mortgage
        </b-form-invalid-feedback>

        <b-row>
          <b-col md="6" lg="4" class="mb-5">
            <b-input-group prepend="£">
              <b-form-input
                id="borrowing-amount"
                ref="IntendedBorrowing"
                v-model="IntendedBorrowing"
                :disabled="ReadOnlyDIP"
                type="number"
              ></b-form-input>
            </b-input-group>
          </b-col>
        </b-row>
      </template>

      <b-row no-gutters>
        <b-button
          variant="outline-primary"
          class="mr-2"
          :disabled="requestInProgress"
          @click="navigateBack"
        >
          Previous
        </b-button>
        <b-button
          variant="primary"
          :disabled="requestInProgress"
          @click="navigateForward"
        >
          Next
        </b-button>
      </b-row>
    </template>
  </b-container>
</template>

<script>
import Vue from "vue";
import Vuelidate from "vuelidate";
import { minValue, required } from "vuelidate/lib/validators";
import { validateForm } from "../../../lib/validation";
Vue.use(Vuelidate);

export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
    };
  },
  computed: {
    ReadOnlyDIP: {
      get() {
        return this.$store.getters["Global/ReadOnlyDIP"];
      },
    },
    ApiOptions: {
      get() {
        return this.$store.getters["Global/ApiOptions"];
      },
    },
    MainApplicant: {
      get() {
        return this.$store.getters["DecisionInPrinciple/MainApplicant"];
      },
    },
    PlotId: {
      get() {
        return this.$store.getters["DecisionInPrinciple/Plot_Plot_PlotId"];
      },
    },
    BuildingType: {
      get() {
        return this.$store.getters["DecisionInPrinciple/Plot_DesignType_Name"];
      },
    },
    ApplyingForMortgage: {
      get() {
        return this.$store.getters["DecisionInPrinciple/ApplyingForMortgage"];
      },
      set(payload) {
        this.$store.commit(
          "DecisionInPrinciple/setApplyingForMortgage",
          payload
        );
      },
    },
    TotalNetIncomeForMortgage: {
      get() {
        return this.$store.getters[
          "DecisionInPrinciple/TotalNetIncomeForMortgage"
        ];
      },
      set(payload) {
        this.$store.commit(
          "DecisionInPrinciple/setTotalNetIncomeForMortgage",
          payload
        );
      },
    },
    IntendedBorrowing: {
      get() {
        return this.$store.getters["DecisionInPrinciple/IntendedBorrowing"];
      },
      set(payload) {
        this.$store.commit("DecisionInPrinciple/setIntendedBorrowing", payload);
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$dipGetService.$get("", this.ApiOptions).then((response) => {
        this.$store.commit("DecisionInPrinciple/setDIPData", response);
        this.loading = false;
      });
    },
    resetValues() {
      this.TotalNetIncomeForMortgage = 0;
      this.IntendedBorrowing = 0;
    },
    navigateBack() {
      this.$router.push("/self-build-wales/decision-in-principle/page-5");
    },
    navigateForward() {
      if (this.ReadOnlyDIP)
        this.$router.push("/self-build-wales/decision-in-principle/page-7");
      else {
        this.requestInProgress = true;
        if (validateForm(this.$v, this)) {
          this.requestInProgress = false;
          return;
        }
        this.$store.commit("DecisionInPrinciple/setPageOffSet", 7);
        this.$dipPostService
          .$post(
            "",
            this.$store.getters["DecisionInPrinciple/DIPData"],
            this.ApiOptions
          )
          .then((response) => {
            this.$router.push("/self-build-wales/decision-in-principle/page-7");
            this.requestInProgress = false;
          })
          .catch(() => (this.requestInProgress = false));
      }
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
  },
  validations: {
    ApplyingForMortgage: {
      required,
    },
    TotalNetIncomeForMortgage: {
      required,
      minValue: minValue(0),
    },
    IntendedBorrowing: {
      required,
      minValue: minValue(0),
    },
  },
};
</script>

<style lang="scss"></style>
