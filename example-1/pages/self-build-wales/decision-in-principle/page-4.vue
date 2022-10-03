<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <template v-else>
      <h1 class="font-weight-bold mb-4">Land Purchase Deposit</h1>
      <p class="mb-0">
        You will need to have funds available to pay for the Land Purchase
        Deposit.
      </p>
      <p class="mb-0">This is 25% of the total land purchase price.</p>
      <p class="mb-4">
        The remaining 75% will be part of your Self Build Wales loan.
      </p>

      <p class="mb-0">
        You will need the Land Purchase Deposit funds available immediately at
        the start of the Self Build project.
      </p>
      <p class="mb-5">
        These funds must be different to any funds you will use to repay the
        Self Build loan.
      </p>

      <p class="mb-0">Total land cost for your chosen plot is</p>
      <p class="mb-0">£{{ numberWithCommas(LandCost.toFixed(0)) }}</p>
      <p class="mb-0">You need to pay 25% of this</p>
      <p class="mb-0">
        The <strong>Land Purchase Deposit</strong> amount you will need to pay
        is
      </p>
      <p class="font-weight-bold mb-5">
        £{{ numberWithCommas((LandCost / 4).toFixed(0)) }}
      </p>

      <p class="font-weight-bold mb-3">
        Do you have funds readily available to pay for this?
      </p>
      <p class="mb-0">
        These funds can be from cash, savings or a personal loan.
      </p>
      <p class="mb-3">
        These funds <strong>cannot be included</strong> in the funds you use to
        repay the Self Build Wales loan.
      </p>

      <b-form-group class="mb-5">
        <b-form-invalid-feedback
          id="applicant-SuitableFundsAvailable-feedback"
          class="error"
          style="color: crimson"
          >Please select if you have the funds readily
          available</b-form-invalid-feedback
        >
        <b-form-radio-group
          id="applicant-funds-avaliable"
          v-model="$v.SuitableFundsAvailable.$model"
          stacked
          :disabled="ReadOnlyDIP"
          class="mb-3"
          name="joint-application-group"
          :state="validateState('SuitableFundsAvailable')"
        >
          <b-form-radio name="funds-avaliable" :value="true">
            Yes, I have suitable funds available
          </b-form-radio>
          <b-form-radio name="funds-avaliable" :value="false">
            No, I do not have suitable funds readily available
          </b-form-radio>
        </b-form-radio-group>
        <p v-if="SuitableFundsAvailable === false" class="font-italic mb-3">
          The Self Build Wales team will need to contact you about this. It may
          not be possible for you to proceed without the funds available.
        </p>
      </b-form-group>
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
import { validateForm } from "../../../lib/validation";
Vue.use(Vuelidate);

export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
    };
  },
  validations: {
    SuitableFundsAvailable: {
      required,
    },
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
    LandCost: {
      get() {
        return this.$store.getters[
          "DecisionInPrinciple/Plot_Plot_TotalPlotLandCost"
        ];
      },
    },
    SuitableFundsAvailable: {
      get() {
        return this.$store.getters[
          "DecisionInPrinciple/SuitableFundsAvailable"
        ];
      },
      set(payload) {
        this.$store.commit(
          "DecisionInPrinciple/setSuitableFundsAvailable",
          payload
        );
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    numberWithCommas(number) {
      if (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    },
    getData() {
      this.$dipGetService.$get(``, this.ApiOptions).then((response) => {
        this.$store.commit("DecisionInPrinciple/setDIPData", response);
        this.loading = false;
      });
    },
    navigateBack() {
      this.$router.push("/self-build-wales/decision-in-principle/page-3");
    },
    navigateForward() {
      if (this.ReadOnlyDIP)
        this.$router.push("/self-build-wales/decision-in-principle/page-5");
      else {
        this.requestInProgress = true;
        if (validateForm(this.$v, this)) {
          this.requestInProgress = false;
          return;
        }
        this.$store.commit("DecisionInPrinciple/setPageOffSet", 5);
        this.$dipPostService
          .$post(
            "",
            this.$store.getters["DecisionInPrinciple/DIPData"],
            this.ApiOptions
          )
          .then((response) => {
            this.$router.push("/self-build-wales/decision-in-principle/page-5");
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
};
</script>

<style lang="scss"></style>
