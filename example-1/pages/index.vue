<template>
  <b-container class="h-100">
    <PageLoading v-if="loading" />
    <template v-else>
      <b-form class="p-3 mt-5" :class="Brand">
        <Alert v-if="$route.query.loggedIn == 'false'" variant="danger">
          <p class="mb-0">Please login and try again.</p>
        </Alert>
        <div class="mb-5">
          <b-button
            :variant="Brand === 'sbw' ? 'primary' : 'outline-primary'"
            @click="setBrand('sbw')"
          >
            SBW
          </b-button>
          <b-button
            :variant="Brand === 'dbw' ? 'primary' : 'outline-primary'"
            @click="setBrand('dbw')"
          >
            DBW
          </b-button>
        </div>

        <h1 class="font-weight-bold mb-5">{{ $t("welcome") }}</h1>
        <p class="mb-5">Please login to access your account area...</p>

        <Alert v-if="interactionInProgress && loginPopupOpen" variant="danger"
          >Login popup is active. If you can't see it, please refresh and try
          again.</Alert
        >

        <div>
          <b-button variant="primary" :disabled="loginPopupOpen" @click="login"
            >Login</b-button
          >
          <b-button
            variant="primary"
            :disabled="loginPopupOpen"
            @click="showPAModal = true"
          >
            Launch Plot Application
          </b-button>
        </div>

        <b-modal
          v-model="showPAModal"
          title="Start a new plot application"
          centered
        >
          <p>Select a plot:</p>
          <b-form-radio-group
            v-model="selectedPlot"
            class="mb-3"
            :options="plotOptions"
            text-field="text"
            stacked
            :disabled="requestInProgress"
          />
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
              :disabled="
                (interactionInProgress && loginPopupOpen) ||
                !selectedPlot ||
                requestInProgress
              "
              @click="launchPlotApplication"
            >
              Start plot application
            </b-button>
          </template>
        </b-modal>
      </b-form>
    </template>
  </b-container>
</template>

<script>
import * as msal from "@azure/msal-browser";

export default {
  data() {
    return {
      brand: this.$route.query.brand || "",
      loading: true,
      requestInProgress: false,
      myMSALObj: new msal.PublicClientApplication(this.$authService.msalConfig),
      showPAModal: false,
      selectedPlot: null,
      loginPopupOpen: false,
      interactionInProgress: false,
      plotOptions: [
        "Plot12345",
        "Plot12319",
        "Plot12336",
        "Plot12346",
        "Plot12347",
        "Plot12348",
        "Plot12349",
        "Plot12326",
        "Plot19346",
      ],
    };
  },
  computed: {
    Brand: {
      get() {
        return this.$store.getters["Global/Brand"];
      },
    },
    ApiOptions: {
      get() {
        return this.$store.getters["Global/ApiOptions"];
      },
    },
    AccountData: {
      get() {
        return this.$store.getters["Global/AccountData"];
      },
    },
  },
  mounted() {
    this.loading = false;
    if (this.brand) this.setBrand(this.brand);
    if (this.$route.query.plotId) this.directPlotApplication();
  },
  methods: {
    setBrand(brand) {
      this.$store.commit("Global/setBrand", brand);
    },
    login(redirect) {
      // check that the login popup has been opened
      this.loginPopupOpen = true;
      this.interactionInProgress = true;

      this.myMSALObj
        .loginPopup(this.$authService.loginRequest)
        .then((res) => {
          this.$authService.tokenRequest.account =
            this.myMSALObj.getAccountByHomeId(res.account.homeAccountId);
          this.myMSALObj
            .acquireTokenSilent(this.$authService.tokenRequest)
            .then((res) => {
              console.log(["opening login prompt: ", res]);
              this.$store.commit("Global/setAccountData", res.account);
              this.$store.commit("Global/setLoggedIn", true);
              this.$store.commit("Global/setApiHeader", {
                Authorization: `Bearer ${res.accessToken}`,
              });
              if (redirect === "PlotApplication") this.launchPlotApplication();
              else this.$router.push("/user-account-area/my-applications");
            });
        })
        .catch((error) => {
          // Another useful error code for the future
          // interaction_in_progress hence why I have local state vars
          // basically doing the same thing at the moment, will prove useful
          // in the future - this occurs if a user tries to click a login button
          // button when a MSAL popup is already active
          if (error.errorCode === "user_cancelled") {
            this.$bvToast.toast(
              `You have closed the login window. Click login to open the login window again.`,
              {
                title: "User has closed login window",
                variant: "danger",
                autoHideDelay: 5000,
                solid: true,
              }
            );
          }

          this.loginPopupOpen = false;
          this.interactionInProgress = false;
        });
    },
    launchPlotApplication() {
      if (!this.AccountData.HomeAccountId) {
        this.login("PlotApplication");
      } else {
        this.requestInProgress = true;
        this.$store.commit("Global/setApiParams", {
          email: this.AccountData.Email,
          plotId: this.selectedPlot,
        });
        this.$plotApplicationApplyService
          .$get("", this.ApiOptions)
          .then((response) => {
            this.$store.commit(
              "PlotApplication/setPlotApplicationData",
              response
            );
            if (response.StatusReason === "Active") {
              this.$store.commit("Global/setReadOnlyPA", false);
            } else {
              this.$store.commit("Global/setReadOnlyPA", true);
            }
            this.$router.push(`/self-build-wales/plot-application/page-1`);
            this.requestInProgress = false;
          })
          .catch(() => {
            this.requestInProgress = false;
          });
      }
    },
    directPlotApplication() {
      if (this.$route.query.plotId) {
        this.launchPlotApplication();
      }
    },
  },
};
</script>

<style lang="scss">
.text {
  height: 120px;
  overflow: hidden;
  &.expanded {
    height: auto;
  }
}
</style>
