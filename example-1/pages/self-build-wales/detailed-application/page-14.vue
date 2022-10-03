<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-5">Applicant additional information</h1>

      <p class="font-weight-bold mb-3">
        Declare relationships between applicants and other parties
      </p>

      <p class="mb-3">
        You must tell us here if any of the applicants have a relationship of
        any kind with any of the other parties, such as the architect, builder,
        contract administrator, solicitor, independent financial advisor or an
        employee of the Development Bank of Wales.
      </p>

      <p class="mb-3">
        If there any family or business connections please describe them here.
        We may need to talk to you about this.
      </p>

      <p class="mb-3">
        If there are no relationships of this kind please say so.
      </p>

      <div class="mb-5">
        <b-form-invalid-feedback
          id="applicantRelationshipDeclaration-feedback"
          :state="validateState('applicantRelationshipDeclaration')"
          class="error mb-1"
        >
          Please provide details of relationships (up to 3500 characters in
          length)
        </b-form-invalid-feedback>
        <b-form-textarea
          id="applicantRelationshipDeclaration"
          ref="applicantRelationshipDeclaration"
          v-model="$v.applicantRelationshipDeclaration.$model"
          :disabled="ReadOnlyDA"
          :state="validateState('applicantRelationshipDeclaration')"
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
import { maxLength, required } from "vuelidate/lib/validators";
import { validateForm } from "../../../lib/validation";
Vue.use(Vuelidate);
export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      applicantRelationshipDeclaration: null,
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
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      if (this.DetailedApplicationData) {
        this.applicantRelationshipDeclaration =
          this.DetailedApplicationData.ApplicantRelationshipDeclaration;
        this.loading = false;
      } else {
        this.$detailedApplicationGetService
          .$get(``, this.ApiOptions)
          .then((response) => {
            this.$store.commit(
              "DetailedApplication/setDetailedApplicationData",
              response
            );
            this.applicantRelationshipDeclaration =
              this.DetailedApplicationData.ApplicantRelationshipDeclaration;
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
        "DetailedApplication/setApplicantRelationshipDeclaration",
        this.applicantRelationshipDeclaration
      );
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 14,
        completed: true,
      });
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
  validations: {
    applicantRelationshipDeclaration: {
      required,
      maxLength: maxLength(3500),
    },
  },
};
</script>

<style lang="scss"></style>
