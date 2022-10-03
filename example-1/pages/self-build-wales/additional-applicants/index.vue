<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <template v-else>
      <h1 class="font-weight-bold mb-5">Additional Applicants Consents</h1>

      <div v-if="!LoggedIn" class="actions">
        <b-button variant="primary" class="btn-primary" @click="signIn">
          Log In
        </b-button>
        <b-button variant="outline-primary" @click="signOut">Sign out</b-button>
      </div>
      <b-form @submit="onApplicationSubmit" @reset="onReset">
        <b-form-group
          id="additional-applicants-consent"
          label="Additional consents"
          description="Please agree to the additional consents"
        >
          <b-form-checkbox
            id="credit-quotation"
            v-model="form.credit_quotation"
            name="credit_quotation"
            value="accepted"
            required
          >
            I consent to DBW undertaking a credit quotation / credit search on
            my behalf
          </b-form-checkbox>
          <b-form-checkbox
            id="privacy-policy"
            v-model="form.privacy_policy"
            name="privacy_policy"
            value="accepted"
            required
          >
            I consent to my data being used in accordance with the data privacy
            policy
          </b-form-checkbox>
        </b-form-group>

        <b-button type="submit" variant="primary" :disabled="isDisabled"
          >Submit</b-button
        >
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </template>
  </b-container>
</template>

<script>
import * as msal from "@azure/msal-browser";
export default {
  data() {
    return {
      form: {
        credit_quotation: false,
        privacy_policy: false,
      },
      loading: true,
      myMSALObj: new msal.PublicClientApplication(this.$authService.msalConfig),
    };
  },
  computed: {
    APIOptions: {
      get() {
        return this.$store.getters["Auth/APIOptions"];
      },
    },
    LoggedIn: {
      get() {
        return !!this.APIOptions;
      },
    },
    isDisabled() {
      return (
        this.form.privacy_policy === false ||
        this.form.credit_quotation === false
      );
    },
  },
  mounted() {
    this.loading = false;
  },
  methods: {
    signIn() {
      this.myMSALObj.loginPopup(this.$authService.loginRequest).then((res) => {
        this.$authService.tokenRequest.account =
          this.myMSALObj.getAccountByHomeId(res.account.homeAccountId);
        this.myMSALObj
          .acquireTokenSilent(this.$authService.tokenRequest)
          .then((res) => {
            const options = {
              params: {
                email: res.account.username,
                plotId: "Plot12345",
                buildingTypeName: "The Portway",
              },
              headers: {
                Authorization: `Bearer ${res.accessToken}`,
              },
            };
            this.$store.commit("Auth/setAPIOptions", options);
          });
      });
    },
    signOut() {
      const logoutRequest = {
        account: this.myMSALObj.getAccountByHomeId(this.accountId),
      };
      this.myMSALObj.logout(logoutRequest);
      // reset all store data
      this.$store.commit("DecisionInPrinciple/setDIPData", null);
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
      this.$store.commit("Auth/setAPIOptions", null);
    },
    onApplicationSubmit() {
      console.log("form submitted");
    },
    onReset() {
      console.log("form reset");
    },
  },
};
</script>

<style lang="scss"></style>
