<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-3">Expected changes</h1>

      <p class="mb-3">
        Are you expecting any changes to your expenditure, creditor spending or
        income in the foreseeable future? (For example, if an outstanding loan
        will be repaid within the next 5 years.)
      </p>

      <p class="mb-3">
        If you are expecting changes then you need to tell us about this.
      </p>

      <p class="mb-3">
        Describe what is changing, by how much, and give an estimate of when any
        changes are expected to happen.
      </p>

      <div class="mb-5">
        <b-form-textarea
          id="expectedChanges"
          ref="expectedChanges"
          v-model="$v.expectedChanges.$model"
          :disabled="ReadOnlyDA"
          rows="8"
          class="mb-2"
          :state="validateState('expectedChanges')"
        />
        <b-form-invalid-feedback id="expectedChanges-feedback" class="error">
          Please enter a maximum of 1500 characters
        </b-form-invalid-feedback>
        <div class="d-flex">
          <div class="text-left">
            <p
              :class="
                countText <= 1500
                  ? 'text-success'
                  : 'text-danger'
              "
            >
              {{ countText > 0 ? countText : 0 }} / 1500
            </p>
          </div>
        </div>
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
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { validateForm } from "../../../lib/validation";
Vue.use(Vuelidate);
export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      expectedChanges: null,
    };
  },
  computed: {
    countText() {
      return this.expectedChanges && this.expectedChanges.length;
    },
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
        this.expectedChanges = this.DetailedApplicationData.ExpectedChanges;
        this.loading = false;
      } else {
        this.$detailedApplicationGetService
          .$get(``, this.ApiOptions)
          .then((response) => {
            this.$store.commit(
              "DetailedApplication/setDetailedApplicationData",
              response
            );
            this.expectedChanges = this.DetailedApplicationData.ExpectedChanges;
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
        "DetailedApplication/setExpectedChanges",
        this.expectedChanges
      );
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 9,
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
    expectedChanges: {
      maxLength: maxLength(1500),
    },
  },
};
</script>

<style lang="scss"></style>
