<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-3">Plot purchase deposit</h1>

      <p class="mb-5">
        Tell us here about the plot purchase deposit payment you intend to make,
        and the source of the funding for this.
      </p>

      <p class="font-weight-bold mb-1">Site name</p>
      <p class="mb-3">{{ SiteName }}</p>

      <p class="font-weight-bold mb-1">Plot id</p>
      <p class="mb-3">{{ PlotId }}</p>

      <p class="font-weight-bold mb-1">Land purchase cost</p>
      <p class="mb-3">£{{ numberWithCommas(TotalPlotLandCost) }}</p>

      <p class="font-weight-bold mb-1">Plot purchase deposit</p>
      <p class="mb-1">
        The minimum amount you must pay as the Plot purchase deposit is 25% of
        the Land purchase price.
      </p>
      <p class="mb-1">Minimum plot purchase deposit:</p>
      <p class="mb-3">£{{ numberWithCommas(TotalPlotLandCost / 4) }}</p>

      <p class="mb-1">
        How much do you intend to pay as the Plot purchase deposit?
      </p>
      <div>
        <b-form-invalid-feedback
          id="plotPurchaseDeposit-feedback"
          :state="validateState('plotPurchaseDeposit')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-input-group prepend="£" class="mb-5 w-25">
          <b-form-input
            id="plotPurchaseDeposit"
            ref="plotPurchaseDeposit"
            v-model="$v.plotPurchaseDeposit.$model"
            :disabled="ReadOnlyDA"
            :state="validateState('plotPurchaseDeposit')"
            type="number"
          />
        </b-input-group>
      </div>

      <p class="font-weight-bold mb-1">
        What is the source of funding that will be used to pay the Plot purchase
        deposit?
      </p>
      <p class="mb-1">
        These funds can be from cash, savings or a personal loan.
      </p>
      <p class="mb-3">
        These funds <strong>cannot be included</strong> in the funds you use to
        repay the Self Build Wales loan.
      </p>
      <div class="mb-5">
        <b-form-invalid-feedback
          id="fundingSourceDescription-feedback"
          :state="validateState('fundingSourceDescription')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-textarea
          id="fundingSourceDescription"
          ref="fundingSourceDescription"
          v-model="$v.fundingSourceDescription.$model"
          :disabled="ReadOnlyDA"
          :state="validateState('fundingSourceDescription')"
          rows="8"
          class="mb-1"
        />
      </div>

      <div class="d-flex flex-column">
        <b-button
          variant="primary"
          class="align-self-start mb-3"
          :disabled="ReadOnlyDA || requestInProgress"
          @click="save"
        >
          Save
        </b-button>
        <b-button
          variant="outline-primary"
          class="align-self-start"
          :disabled="requestInProgress"
          @click="backWithoutSaving"
        >
          Back without saving
        </b-button>
      </div>
    </b-form>
  </b-container>
</template>

<script>
import Vue from "vue";
import Vuelidate from "vuelidate";
import { required, minValue } from "vuelidate/lib/validators";
import { validateForm } from "~/lib/validation";
Vue.use(Vuelidate);
export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      plotPurchaseDeposit: null,
      fundingSourceDescription: null,
    };
  },
  computed: {
    ReadOnlyDA: {
      get() {
        return this.$store.getters["Global/ReadOnlyDA"];
      },
    },
    ApiOptions: {
      get() {
        return this.$store.getters["Global/ApiOptions"];
      },
    },
    DetailedApplicationData: {
      get() {
        return this.$store.getters[
          "DetailedApplication/DetailedApplicationData"
        ];
      },
    },
    SiteName: {
      get() {
        return this.$store.getters["DetailedApplication/SiteName"];
      },
    },
    PlotId: {
      get() {
        return this.$store.getters["DetailedApplication/PlotId"];
      },
    },
    TotalPlotLandCost: {
      get() {
        return this.$store.getters["DetailedApplication/TotalPlotLandCost"];
      },
    },
    EnoughFunding: {
      get() {
        return this.$store.getters["DetailedApplication/EnoughFunding"];
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    numberWithCommas(number) {
      if (number < 1000) return number;
      else return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    getData() {
      if (this.DetailedApplicationData) {
        this.loading = false;
        this.plotPurchaseDeposit =
          this.DetailedApplicationData.PlotPurchaseDeposit;
        this.fundingSourceDescription =
          this.DetailedApplicationData.FundingSourceDescription;
      } else {
        this.$detailedApplicationGetService
          .$get(``, this.ApiOptions)
          .then((response) => {
            this.$store.commit(
              "DetailedApplication/setDetailedApplicationData",
              response
            );
            this.plotPurchaseDeposit =
              this.DetailedApplicationData.PlotPurchaseDeposit;
            this.fundingSourceDescription =
              this.DetailedApplicationData.FundingSourceDescription;
            this.loading = false;
          });
      }
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    save() {
      this.requestInProgress = true;
      // validate form
      if (validateForm(this.$v, this)) {
        this.requestInProgress = false;
        return;
      }
      // update store
      this.$store.commit(
        "DetailedApplication/setPlotPurchaseDeposit",
        this.plotPurchaseDeposit
      );
      this.$store.commit(
        "DetailedApplication/setFundingSourceDescription",
        this.fundingSourceDescription
      );
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 13,
        completed: true,
      });
      // mark loan summary incomplete if insufficient funds
      if (!this.EnoughFunding) {
        this.$store.commit("DetailedApplication/updateSectionStatus", {
          pageNumber: 21,
          completed: false,
        });
      }
      // send store data to db
      this.$detailedApplicationPostService
        .$post("", this.DetailedApplicationData, this.ApiOptions)
        .then((response) => {
          this.$store.commit(
            "DetailedApplication/setDetailedApplicationData",
            response
          );
          this.$router.push(`/self-build-wales/detailed-application/page-2`);
          this.requestInProgress = false;
        })
        .catch(() => (this.requestInProgress = false));
    },
    backWithoutSaving() {
      this.$router.push(`/self-build-wales/detailed-application/page-2`);
    },
  },
  validations() {
    return {
      plotPurchaseDeposit: {
        required,
        minValue: minValue(this.TotalPlotLandCost / 4),
      },
      fundingSourceDescription: {
        required,
      },
    };
  },
};
</script>

<style lang="scss"></style>
