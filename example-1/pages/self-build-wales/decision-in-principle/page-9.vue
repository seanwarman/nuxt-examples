<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <template v-else>
      <h1 class="font-weight-bold mb-3">Summary</h1>
      <h3 class="font-weight-bold mb-3">Summary of affordability</h3>

      <p class="mb-2">The estimated value for the Self Build Wales loan is:</p>
      <p class="mb-0">
        £{{ numberWithCommas(MinCost) }} to £{{ numberWithCommas(MaxCost) }}
        build costs
      </p>
      <p class="mb-4">£{{ numberWithCommas(LandCost) }} Land purchase cost</p>

      <p class="mb-0">Total</p>
      <p class="mb-4">
        £{{ numberWithCommas(MinCost + LandCost) }} - £{{
          numberWithCommas(MaxCost + LandCost)
        }}
      </p>

      <p class="mb-0">
        You have given details of total funds for repaying the Self Build Wales
        loan of
      </p>
      <p class="mb-4">£{{ numberWithCommas(FundsForLoan) }}</p>

      <p class="mb-0">
        You also need to have available funds to pay the Land Purchase Deposit
        of
      </p>
      <p class="mb-4">£{{ numberWithCommas(LandCost / 4) }}</p>

      <h3 class="font-weight-bold mb-2">Data privacy</h3>
      <p class="mb-3">
        By ticking the boxes below you give consent for Development Banc Wales
        to use your data etc ……….
      </p>
      <p class="mb-3">
        Our data privacy policy can be found here:
        <a href="https://developmentbank.wales/privacy-policy">
          developmentbank.wales/privacy-policy
        </a>
      </p>

      <div class="mb-5">
        <ApplicantDataConsent
          v-for="(application, index) in Applications"
          ref="childDataConsent"
          :key="index"
          :application-id="application.Id"
          :consent-index="index"
        />
      </div>

      <h3 class="font-weight-bold mb-3">Submit the application</h3>
      <p class="mb-2">
        After you submit your application you will not be able to recall or edit
        it.
      </p>
      <p class="mb-5">
        The Self Build Wales Team will get in touch with you if they need more
        information to process your application.
      </p>

      <b-row no-gutters>
        <b-button
          variant="outline-primary"
          class="mr-2 mb-2 mb-md-0"
          @click="navigateBack"
        >
          Previous
        </b-button>
        <b-button
          variant="primary"
          :disabled="ReadOnlyDIP"
          @click="launchModal"
        >
          Submit Application
        </b-button>
        <b-modal id="submitModal" v-model="showModal" centered>
          <p>Are you sure you want to submit this application?</p>
          <template #modal-footer="{ cancel }">
            <b-button
              variant="outline-primary"
              :disabled="requestInProgress"
              @click="cancel()"
            >
              Cancel
            </b-button>
            <b-button
              variant="primary"
              :disabled="requestInProgress"
              @click="navigateForward"
            >
              Ok
            </b-button>
          </template>
        </b-modal>
      </b-row>
    </template>
  </b-container>
</template>

<script>
import ApplicantDataConsent from "~/components/decision-in-principle/ApplicantDataConsent";
import { numberWithCommas } from "~/lib/globalFunctions";
export default {
  components: {
    ApplicantDataConsent,
  },
  data() {
    return {
      loading: true,
      requestInProgress: false,
      showModal: false,
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
    MinCost: {
      get() {
        return this.$store.getters[
          "DecisionInPrinciple/Plot_DesignType_MinCost"
        ];
      },
    },
    MaxCost: {
      get() {
        return this.$store.getters[
          "DecisionInPrinciple/Plot_DesignType_MaxCost"
        ];
      },
    },
    LandCost: {
      get() {
        return this.$store.getters[
          "DecisionInPrinciple/Plot_Plot_TotalPlotLandCost"
        ];
      },
    },
    FundsForLoan: {
      get() {
        return this.$store.getters["DecisionInPrinciple/FundsForLoan"];
      },
    },
    Applications: {
      get() {
        return this.$store.getters["DecisionInPrinciple/Applications"];
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    numberWithCommas,
    launchModal() {
      let anyInvalid = false;
      this.$refs.childDataConsent.forEach(function (index) {
        if (index.validateChild()) {
          anyInvalid = true;
        }
      });
      if (anyInvalid) {
        return;
      }
      this.showModal = true;
    },
    getData() {
      this.$dipGetService.$get("", this.ApiOptions).then((response) => {
        this.$store.commit("DecisionInPrinciple/setDIPData", response);
        this.loading = false;
      });
    },
    navigateBack() {
      this.$router.push("/self-build-wales/decision-in-principle/page-8");
    },
    navigateForward() {
      this.requestInProgress = true;
      this.$store.commit("DecisionInPrinciple/setPageOffSet", 10);
      this.$store.commit("DecisionInPrinciple/setSubmitted");
      this.$dipPostService
        .$post(
          "",
          this.$store.getters["DecisionInPrinciple/DIPData"],
          this.ApiOptions
        )
        .then((response) => {
          this.$router.push("/self-build-wales/decision-in-principle/page-10");
          this.requestInProgress = false;
        })
        .catch(() => (this.requestInProgress = false));
    },
  },
};
</script>

<style lang="scss"></style>
