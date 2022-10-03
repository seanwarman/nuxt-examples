<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <template v-else>
      <h1 class="font-weight-bold mb-3">
        Consent to Credit Quotation searches
      </h1>
      <p class="mb-3">
        To ensure we have the necessary facts to assess your application, verify
        your identity, to help prevent fraud and to provide you with a decision
        in principle, we will obtain information from third parties.
      </p>
      <p class="mb-3">
        This information includes a Credit Quotation Search from a credit
        referencing agency. This search will appear on your credit report and
        will be visible to you and us but not to other credit providers.
      </p>
      <p>
        <a
          href="https://developmentbankwales.sharepoint.com/:b:/s/DTDocuments/EcqBx8KVNrtPjSfB97jicukB6FZ7TTSQV40OZbNnUJ7l3g?e=i5arTD"
          target="_blank"
          rel="noopener noreferrer"
        >
          Credit Quotation Consents Policy
        </a>
      </p>
      <p class="mb-3">
        Tick the boxes below to indicate that you happy to continue.
      </p>
      <div class="mb-5">
        <ApplicantCreditConsent
          v-for="(application, index) in Applications"
          ref="childCredit"
          :key="index"
          :credit-index="index"
          :application-id="application.Id"
        />
      </div>

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
import ApplicantCreditConsent from "~/components/decision-in-principle/ApplicantCreditConsent";
export default {
  components: {
    ApplicantCreditConsent,
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
    getData() {
      this.$dipGetService.$get("", this.ApiOptions).then((response) => {
        this.$store.commit("DecisionInPrinciple/setDIPData", response);
        this.loading = false;
      });
    },
    navigateBack() {
      this.$router.push("/self-build-wales/decision-in-principle/page-7");
    },
    navigateForward() {
      if (this.ReadOnlyDIP)
        this.$router.push("/self-build-wales/decision-in-principle/page-9");
      else {
        this.requestInProgress = true;
        let anyInvalid = false;
        this.$refs.childCredit.forEach(function (index) {
          if (index.validateChild()) {
            anyInvalid = true;
          }
        });
        if (anyInvalid) {
          this.requestInProgress = false;
          return;
        }
        this.$store.commit("DecisionInPrinciple/setPageOffSet", 9);
        this.$dipPostService
          .$post(
            "",
            this.$store.getters["DecisionInPrinciple/DIPData"],
            this.ApiOptions
          )
          .then((response) => {
            this.$router.push("/self-build-wales/decision-in-principle/page-9");
            this.requestInProgress = false;
          })
          .catch(() => (this.requestInProgress = false));
      }
    },
  },
};
</script>

<style lang="scss"></style>
