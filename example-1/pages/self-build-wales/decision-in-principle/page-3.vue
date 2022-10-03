<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <template v-else>
      <h1 class="font-weight-bold mb-3">Applicant details</h1>
      <p class="mb-5">We need to know more details about the applicants</p>

      <ApplicantDetails2
        v-for="(application, index) in Applications"
        ref="applicantDetailsChild"
        :key="index"
        :index="index"
        :application-id="application.Id"
      />

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
import ApplicantDetails2 from "~/components/decision-in-principle/ApplicantDetails2";
Vue.use(Vuelidate);
export default {
  components: {
    ApplicantDetails2,
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
      this.$dipGetService.$get(``, this.ApiOptions).then((response) => {
        this.$store.commit("DecisionInPrinciple/setDIPData", response);
        this.loading = false;
      });
    },
    navigateBack() {
      this.$router.push("/self-build-wales/decision-in-principle/page-2");
    },
    navigateForward() {
      if (this.ReadOnlyDIP)
        this.$router.push("/self-build-wales/decision-in-principle/page-4");
      else {
        this.requestInProgress = true;
        let anyInvalid = false;
        this.$refs.applicantDetailsChild.forEach(function (index) {
          if (index.validateChild()) {
            anyInvalid = true;
          }
        });
        if (anyInvalid) {
          this.requestInProgress = false;
          return;
        }
        this.$store.commit("DecisionInPrinciple/setPageOffSet", 4);
        this.$dipPostService
          .$post(
            "",
            this.$store.getters["DecisionInPrinciple/DIPData"],
            this.ApiOptions
          )
          .then((response) => {
            this.$router.push("/self-build-wales/decision-in-principle/page-4");
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
