<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-3">Savings</h1>

      <p class="mb-1">
        Do you intend to repay any of the Self Build Wales loan using savings?
      </p>
      <p class="mb-3">
        This will be in addition to any savings you intend to use to pay for the
        Land Purchase Deposit.
      </p>
      <b-form-invalid-feedback
        id="usingSavings-feedback"
        :state="validateState('usingSavings')"
        class="error"
      >
        Invalid
      </b-form-invalid-feedback>
      <b-form-group
        id="usingSavings"
        ref="usingSavings"
        class="mb-5"
        :disabled="ReadOnlyDA"
      >
        <b-form-radio
          v-model="$v.usingSavings.$model"
          :state="validateState('usingSavings')"
          :value="true"
          @change="resetToNull"
        >
          Yes
        </b-form-radio>
        <b-form-radio
          v-model="$v.usingSavings.$model"
          :state="validateState('usingSavings')"
          :value="false"
          @change="resetToZero"
        >
          No
        </b-form-radio>
      </b-form-group>

      <template v-if="usingSavings">
        <div
          v-for="(applicant, index) in $v.applicantsArray.$each.$iter"
          :key="index"
        >
          <p class="mb-1">For {{ applicant.Name.$model }}</p>
          <p class="mb-2">
            What is the total of this applicant's savings that will be used to
            repay the Self Build Wales loan?
          </p>
          <b-form-invalid-feedback
            id="SavingsAmount-feedback"
            :state="
              validateArrayItemState('applicantsArray', index, 'SavingsAmount')
            "
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-input-group prepend="£" class="mb-4 w-25">
            <b-form-input
              :id="`SavingsAmount-${index}`"
              :ref="`SavingsAmount-${index}`"
              v-model="applicant.SavingsAmount.$model"
              :disabled="ReadOnlyDA"
              :state="
                validateArrayItemState(
                  'applicantsArray',
                  index,
                  'SavingsAmount'
                )
              "
              type="number"
            />
          </b-input-group>
        </div>
        <p class="mb-2">
          Total savings you will use to repay the Self Build Wales loan
        </p>
        <p class="mb-5">£ {{ numberWithCommas(TotalUsedSavings) }}</p>
      </template>

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
import { required, requiredIf, numeric } from "vuelidate/lib/validators";
import { validateRepeat, isAssigned } from "~/lib/validation";
import { numberWithCommas, findBoolean } from "~/lib/globalFunctions";
Vue.use(Vuelidate);
export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      usingSavings: null,
      applicantsArray: [],
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
    TotalUsedSavings: {
      get() {
        return this.applicantsArray
          .map((applicant) => Number(applicant.SavingsAmount))
          .reduce((a, b) => a + b, 0);
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
    numberWithCommas,
    getData() {
      if (this.DetailedApplicationData) {
        this.mapStoreValuesToComponentState();
        this.loading = false;
      } else {
        this.$detailedApplicationGetService
          .$get(``, this.ApiOptions)
          .then((response) => {
            this.$store.commit(
              "DetailedApplication/setDetailedApplicationData",
              response
            );
            this.mapStoreValuesToComponentState();
            this.loading = false;
          });
      }
    },
    mapStoreValuesToComponentState() {
      const d = this.DetailedApplicationData;
      this.usingSavings = findBoolean(d.UsingSavings);
      d.Applications.forEach((applicant) => {
        this.applicantsArray.push({
          Id: applicant.Id,
          Name: `${
            applicant.ApplicantFirstName ? applicant.ApplicantFirstName : ""
          } ${applicant.ApplicantLastName ? applicant.ApplicantLastName : ""}`,
          SavingsAmount: applicant.SavingsAmount,
        });
      });
    },
    resetToZero() {
      this.applicantsArray.forEach((applicant) => {
        applicant.SavingsAmount = 0;
      });
    },
    resetToNull() {
      this.applicantsArray.forEach((applicant) => {
        applicant.SavingsAmount = null;
      });
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    validateArrayItemState(array, index, name) {
      const { $dirty, $error } = this.$v[array].$each.$iter[index][name];
      return $dirty ? !$error : null;
    },
    save() {
      this.requestInProgress = true;
      // validate form
      if (validateRepeat(this.$v, this)) {
        this.requestInProgress = false;
        return;
      }
      // map data to store
      this.$store.commit("DetailedApplication/setSavings", this);
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 12,
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
  validations: {
    usingSavings: {
      required,
      isAssigned,
    },
    applicantsArray: {
      $each: {
        Id: {},
        Name: {},
        SavingsAmount: {
          required: requiredIf(function () {
            return this.usingSavings;
          }),
          numeric,
        },
      },
    },
  },
};
</script>

<style lang="scss"></style>
