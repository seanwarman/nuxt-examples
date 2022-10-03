<template>
  <b-container class="p-3 dbw">
    <PageLoading v-if="loading" />
    <div v-else>
      <div class="header mb-5">
        <h1 class="font-weight-bold mb-3">Submit Application</h1>
      </div>

      <Alert variant="warning"
        >Once you've submitted the application you will no longer be able to
        make changes. Any mistakes will cause delays with progressing your
        case.</Alert
      >

      <p class="mb-5">
        You've completed all of the sections for your Investment Application. Do
        you want to submit the application now?
      </p>

      <div class="d-flex flex-column">
        <b-button
          variant="primary"
          class="align-self-start mb-3"
          :disabled="requestInProgress"
          @click="save"
        >
          {{ ReadOnlyIA ? "Continue" : "Submit" }}
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
    </div>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
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
          },
        });
      } else {
        this.loading = false;
      }
    },
    save() {
      this.requestInProgress = true;

      this.$store.commit("InvestmentApplication/setSubmitted");

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

          this.$router.push(`/dev-bank-wales/investment-application/page-8`);

          this.requestInProgress = false;
        })
        .catch(() => (this.requestInProgress = false));
    },
    backWithoutSaving() {
      const isRegistered = [
        "LimitedCompany",
        "CompanyLtdByGuarantee",
        "LimitedLiabilityPartnership",
      ].includes(this.InvestmentApplicationData.BusinessType);

      if (!isRegistered) {
        this.$router.push(`/dev-bank-wales/investment-application/page-5`);
      } else {
        this.$router.push(`/dev-bank-wales/investment-application/page-6`);
      }
    },
  },
};
</script>
