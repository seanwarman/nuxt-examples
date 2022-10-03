<template>
  <b-container class="p-3 dbw">
    <PageLoading v-if="loading" />
    <template v-if="!LoggedIn & !loading">
      <p>Please log in to complete Investment Application form</p>
      <b-button variant="primary" class="btn-primary" @click="login">
        Log In
      </b-button>
    </template>
    <template v-else>
      <h1 class="font-weight-bold mb-5">Investment applications</h1>
      <template v-if="LoggedIn && !loading">
        <div
          v-if="InvestmentApplications && InvestmentApplications.length"
          class="application-table w-50 mb-5"
        >
          <div
            v-for="application in InvestmentApplications"
            :key="application.ApplicationReference"
            class="application-item"
            @click="navigateToApplication(application.ApplicationReference)"
          >
            <p>
              <b>Company name:</b>
              {{ application.CompanyName ? application.CompanyName : "n/a" }}
            </p>

            <p>
              <b>Application date:</b>
              {{
                application.ApplicationDate
                  ? formatDate(application.ApplicationDate)
                  : "n/a"
              }}
            </p>

            <p>
              <b>Application reference:</b>
              {{
                application.ApplicationReference
                  ? application.ApplicationReference
                  : "n/a"
              }}
            </p>
          </div>
        </div>
      </template>

      <div class="d-flex flex-column pt-5">
        <b-button
          variant="primary"
          class="align-self-start mb-3"
          @click="startNewApplication"
        >
          Start new application
        </b-button>
        <b-button
          variant="outline-primary"
          class="align-self-start mb-3"
          @click="signOutModalOpen = true"
        >
          Sign out
        </b-button>
      </div>
    </template>
    <b-modal v-model="signOutModalOpen" centered>
      <p class="mb-0">Are you sure you want to sign out?</p>
      <template #modal-footer="{ cancel }">
        <b-button variant="outline-primary" @click="cancel()">
          No cancel
        </b-button>
        <b-button variant="primary" @click="signOut"> Yes continue </b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import * as msal from "@azure/msal-browser";
import { formatDate } from "~/lib/globalFunctions";

export default {
  data() {
    return {
      loading: true,
      myMSALObj: new msal.PublicClientApplication(this.$authService.msalConfig),
      signOutModalOpen: false,
    };
  },
  computed: {
    AccountData: {
      get() {
        return this.$store.getters["Global/AccountData"];
      },
    },
    InvestmentApplications: {
      get() {
        return this.$store.getters[
          "InvestmentApplication/InvestmentApplications"
        ];
      },
    },
    LoggedIn: {
      get() {
        return this.$store.getters["Global/LoggedIn"];
      },
    },
  },
  mounted() {
    this.setBrand();
    this.isLoggedIn();
    if (this.$route.query.newForm) {
      this.$store.commit("Global/setFormType", true);
    }
  },
  methods: {
    isLoggedIn() {
      if (!this.$store.state.Global.LoggedIn) {
        this.login();
      } else {
        this.getApplications();
      }
    },
    login() {
      this.myMSALObj.loginPopup(this.$authService.loginRequest).then((res) => {
        this.$authService.tokenRequest.account =
          this.myMSALObj.getAccountByHomeId(res.account.homeAccountId);
        this.myMSALObj
          .acquireTokenSilent(this.$authService.tokenRequest)
          .then((res) => {
            this.$store.commit("Global/setAccountData", res.account);
            this.$store.commit("Global/setLoggedIn", true);
            this.$store.commit("Global/setApiHeader", {
              Authorization: `Bearer ${res.accessToken}`,
            });
            this.loading = true;
            if (this.$route.query.newForm === "new") {
              this.startNewApplication();
            } else {
              this.getApplications();
            }
          });
      });
    },
    formatDate,
    getApplications() {
      this.$investmentApplicationsGetService
        .$get("", { params: { email: this.AccountData.Email } })
        .then((response) => {
          this.$store.commit(
            "InvestmentApplication/setInvestmentApplications",
            response
          );

          this.loading = false;
        });
    },
    navigateToApplication(applicationId) {
      this.loading = true;
      this.$investmentApplicationGetService
        .$get("", { params: { appref: applicationId } })
        .then((response) => {
          this.$store.commit(
            "InvestmentApplication/setInvestmentApplicationData",
            response
          );
          const pageNumber = response.PageNo === 0 ? 2 : response.PageNo;
          this.$router.push(
            `/dev-bank-wales/investment-application/page-${pageNumber}`
          );
        });
    },
    setBrand() {
      this.$store.commit("Global/setBrand", "dbw");
    },
    startNewApplication() {
      this.$investmentApplicationCreateService
        .$post("", null, { params: { email: this.AccountData.Email } })
        .then((response) => {
          this.$store.commit(
            "InvestmentApplication/setInvestmentApplicationData",
            response
          );
          this.$router.push(`/dev-bank-wales/investment-application/page-2`);
        });
    },
    signOut() {
      const logoutRequest = {
        account: this.myMSALObj.getAccountByHomeId(
          this.AccountData.HomeAccountId
        ),
      };
      this.myMSALObj.logout(logoutRequest);
      // reset all store data
      this.$store.commit("Global/resetGlobalData");
      this.$store.commit("PlotApplication/setPlotApplicationData", null);
      this.$store.commit(
        "DetailedApplication/setDetailedApplicationData",
        null
      );
      this.$store.commit(
        "InvestmentApplication/setInvestmentApplicationData",
        null
      );
      this.$store.commit(
        "InvestmentApplication/setInvestmentApplications",
        null
      );
    },
  },
};
</script>

<style lang="scss">
.application-table {
  border: 1px solid #ddd;
  padding: 0;
  border-radius: 5px;
}
.application-item {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: none;
  }
  p {
    margin: 0;
  }
}
</style>
