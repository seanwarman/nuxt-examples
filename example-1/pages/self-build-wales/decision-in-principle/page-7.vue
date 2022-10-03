<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <template v-else>
      <h1 class="font-weight-bold mb-3">Cash Savings</h1>

      <b-form-group
        class="mb-5"
        label="Do you intend to repay any of the Self Build Wales loan using cash savings?"
      >
        <p class="mb-3">
          This will be in addition to any savings you intend to use to pay for
          the Land Purchase Deposit.
        </p>
        <b-form-invalid-feedback
          id="savings-used-for-lpd-feedback"
          class="error mb-3"
          style="color: crimson"
          :state="validateState('RepayLoanWithSavings')"
        >
          Please select if you intend to repay any of the Self Build Wales loan
          using cash savings
        </b-form-invalid-feedback>
        <b-form-radio-group
          id="savings-used-for-lpd-group"
          ref="RepayLoanWithSavings"
          v-model="RepayLoanWithSavings"
          :disabled="ReadOnlyDIP"
          stacked
          name="savings-used-for-lpd"
        >
          <b-form-radio name="mortage-financing-loan-group" :value="true">
            Yes
          </b-form-radio>
          <b-form-radio name="mortage-financing-loan-group" :value="false">
            No
          </b-form-radio>
        </b-form-radio-group>
      </b-form-group>

      <template v-if="RepayLoanWithSavings">
        <ApplicantSavings
          v-for="(application, index) in Applications"
          ref="savingsChild"
          :key="index"
          :savings-index="index"
          :application-id="application.Id"
        />
        <p class="mb-0">
          Total cash savings you will use to repay the Self Build Wales loan
        </p>
        <p class="mb-5">£ {{ numberWithCommas(TotalSavings.toFixed(2)) }}</p>
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
import { required } from "vuelidate/lib/validators";
import { numberWithCommas } from "~/lib/globalFunctions";
import { validateForm } from "~/lib/validation";
import ApplicantSavings from "~/components/decision-in-principle/ApplicantSavings";
Vue.use(Vuelidate);
export default {
  components: {
    ApplicantSavings,
  },
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
    RepayLoanWithSavings: {
      get() {
        return this.$store.getters["DecisionInPrinciple/RepayLoanWithSavings"];
      },
      set(payload) {
        this.$store.commit(
          "DecisionInPrinciple/setRepayLoanWithSavings",
          payload
        );
      },
    },
    Applications: {
      get() {
        return this.$store.getters["DecisionInPrinciple/Applications"];
      },
    },
    TotalSavings: {
      get() {
        return this.Applications.map((a) => Number(a.SavingsAmount)).reduce(
          (a, b) => a + b,
          0
        );
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    numberWithCommas,
    getData() {
      this.$dipGetService.$get("", this.ApiOptions).then((response) => {
        this.$store.commit("DecisionInPrinciple/setDIPData", response);
        this.loading = false;
      });
    },
    navigateBack() {
      this.$router.push("/self-build-wales/decision-in-principle/page-6");
    },
    navigateForward() {
      if (this.ReadOnlyDIP)
        this.$router.push("/self-build-wales/decision-in-principle/page-8");
      else {
        this.requestInProgress = true;
        if (validateForm(this.$v, this)) {
          this.requestInProgress = false;
          return;
        }
        let anyInvalid = false;
        if (this.RepayLoanWithSavings) {
          this.$refs.savingsChild.forEach(function (index) {
            if (index.validateChild()) {
              anyInvalid = true;
            }
          });
        }
        if (anyInvalid) {
          this.requestInProgress = false;
          return;
        }
        this.$store.commit("DecisionInPrinciple/setPageOffSet", 8);
        this.$dipPostService
          .$post(
            "",
            this.$store.getters["DecisionInPrinciple/DIPData"],
            this.ApiOptions
          )
          .then((response) => {
            this.$router.push("/self-build-wales/decision-in-principle/page-8");
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
    RepayLoanWithSavings: {
      required,
    },
  },
};
</script>

<style lang="scss"></style>
