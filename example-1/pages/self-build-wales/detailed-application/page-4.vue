<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-5">Applicant details</h1>

      <p class="mb-5">Guidance text here if needed</p>

      <ul class="applicants mb-5">
        <li
          v-for="(applicant, index) in Applications"
          :key="index"
          class="mb-5"
        >
          <h3 class="font-weight-bold mb-3">Applicant {{ index + 1 }}</h3>

          <h6 class="font-weight-bold mb-1">Applicant name</h6>
          <p class="mb-4">
            {{ applicant.ApplicantFirstName }} {{ applicant.ApplicantLastName }}
          </p>

          <h6 class="font-weight-bold mb-1">Phone number</h6>
          <p class="mb-4">{{ applicant.ApplicantPhoneNumber }}</p>

          <h6 class="font-weight-bold mb-1">Email</h6>
          <p class="mb-4">{{ applicant.ApplicantEmail }}</p>

          <h6 class="font-weight-bold mb-1">Date of birth</h6>
          <p class="mb-4">{{ formatDate(applicant.ApplicantDateOfBirth) }}</p>
        </li>
      </ul>

      <h3 class="font-weight-bold mb-1">Marriages and civil partnerships</h3>
      <p class="mb-4">
        Are any of the applicants either married or in a civil partnership?
      </p>

      <div
        v-for="(applicant, index) in $v.applicantsArray.$each.$iter"
        :key="index"
        class="mb-5"
      >
        <p class="font-weight-bold mb-0">
          {{ applicant.firstName.$model }} {{ applicant.lastName.$model }}
        </p>
        <p class="mb-1">Select one option</p>
        <b-form-invalid-feedback
          :id="`relationshipStatus-${index}-feedback`"
          class="error mb-2"
          :state="
            validateState($v.applicantsArray.$each[index].relationshipStatus)
          "
        >
          Please select {{ applicant.firstName.$model }}'s relationship status
        </b-form-invalid-feedback>
        <b-form-radio-group
          :id="`relationshipStatus-${index}`"
          v-model="applicant.relationshipStatus.$model"
          :disabled="ReadOnlyDA"
          @change="updateEffectedApplicants(applicant.id.$model)"
        >
          <b-form-radio value="NoRelationship">
            Not married or in a civil partnership
          </b-form-radio>
          <b-form-radio value="RelationshipWithNonApplicant">
            Married to, or in a civil partnership with, someone who is not an
            applicant
          </b-form-radio>
          <template v-if="applicantsArray.length > 1">
            <b-form-radio value="RelationshipWithCoApplicant">
              Married to, or in a civil partnership with, someone who is an
              applicant
            </b-form-radio>
          </template>
        </b-form-radio-group>

        <template
          v-if="
            applicant.relationshipStatus.$model ===
            'RelationshipWithCoApplicant'
          "
        >
          <p class="mb-1 ml-4">Which applicant is this?</p>
          <b-form-invalid-feedback
            :id="`partner-${index}-feedback`"
            class="error mb-2 ml-4"
            :state="validateState($v.applicantsArray.$each[index].partner)"
          >
            Please select {{ applicant.firstName.$model }}'s partner
          </b-form-invalid-feedback>
          <b-form-radio-group
            :id="`partner-${index}`"
            v-model="applicant.partner.$model"
            :disabled="ReadOnlyDA"
            class="ml-4"
            :options="
              partnerOptions.filter(
                (partner) => partner.value !== applicant.id.$model
              )
            "
            text-field="name"
            stacked
            @change="updateEffectedApplicants(applicant.id.$model)"
          />
        </template>
      </div>

      <h3 class="font-weight-bold mb-1">The household at the new home</h3>

      <p class="font-weight-bold mb-1">
        How many adults will live in the new home?
      </p>
      <p class="mb-2">(17 years old and older)</p>
      <b-form-invalid-feedback
        :id="`number-adults-feedback`"
        class="error mb-2"
        :state="validateState($v.howManyAdults)"
      >
        Please enter a valid number of adults
      </b-form-invalid-feedback>
      <b-form-input
        id="howManyAdults"
        v-model="$v.howManyAdults.$model"
        :disabled="ReadOnlyDA"
        class="number-input mb-3"
        type="number"
      />

      <p class="font-weight-bold mb-1">
        How many children will live in the new home?
      </p>
      <p class="mb-2">(16 years old and younger)</p>
      <b-form-invalid-feedback
        :id="`number-children-feedback`"
        class="error mb-2"
        :state="validateState($v.howManyChildren)"
      >
        Please enter a valid number of children
      </b-form-invalid-feedback>
      <b-form-input
        id="howManyChildren"
        v-model="$v.howManyChildren.$model"
        :disabled="ReadOnlyDA"
        class="number-input mb-5"
        type="number"
      />

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
import {
  maxValue,
  minValue,
  numeric,
  required,
  requiredIf,
} from "vuelidate/lib/validators";
import { validateRepeat } from "../../../lib/validation";
Vue.use(Vuelidate);

export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      applicantsArray: [],
      partnerOptions: [],
      howManyAdults: null,
      howManyChildren: null,
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
    Applications: {
      get() {
        return this.$store.getters["DetailedApplication/Applications"];
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    formatDate(date) {
      const d = date.split(/[-.T :]/);
      const newDate = d[2] + "-" + d[1] + "-" + d[0];
      return newDate;
    },
    createApplicantsArray() {
      this.Applications.forEach((applicant) => {
        let relationshipStatus = null;
        if (applicant.RelationshipStatus !== "Unassigned")
          relationshipStatus = applicant.RelationshipStatus;
        let partner = null;
        if (applicant.ApplicantPartner) partner = applicant.ApplicantPartner.Id;
        this.applicantsArray.push({
          id: applicant.Id,
          firstName: applicant.ApplicantFirstName,
          lastName: applicant.ApplicantLastName,
          relationshipStatus,
          partner,
        });
        this.partnerOptions.push({
          name: `
            ${applicant.ApplicantFirstName ? applicant.ApplicantFirstName : ""}
            ${applicant.ApplicantLastName ? applicant.ApplicantLastName : ""}
          `,
          value: applicant.Id,
        });
      });
    },
    updateEffectedApplicants(applicantId) {
      const match = this.applicantsArray.find(
        (applicant) => applicant.id === applicantId
      );
      if (
        match.relationshipStatus === "RelationshipWithCoApplicant" &&
        match.partner
      ) {
        const partnerMatch = this.applicantsArray.find(
          (applicant) => applicant.id === match.partner
        );
        partnerMatch.relationshipStatus = "RelationshipWithCoApplicant";
        partnerMatch.partner = applicantId;
        this.applicantsArray.forEach((applicant) => {
          if (applicant.id !== match.id && applicant.id !== partnerMatch.id) {
            if (
              applicant.partner === match.id ||
              applicant.partner === partnerMatch.id
            ) {
              applicant.relationshipStatus = null;
              applicant.partner = null;
            }
          }
        });
      } else {
        match.partner = null;
        this.applicantsArray.forEach((applicant) => {
          if (applicant.partner === match.id) {
            applicant.relationshipStatus = null;
            applicant.partner = null;
          }
        });
      }
    },
    getData() {
      if (this.DetailedApplicationData) {
        this.createApplicantsArray();
        this.howManyAdults = this.DetailedApplicationData.HowManyAdults;
        this.howManyChildren = this.DetailedApplicationData.HowManyChildren;
        this.loading = false;
      } else {
        this.$detailedApplicationGetService
          .$get(``, this.ApiOptions)
          .then((response) => {
            this.$store.commit(
              "DetailedApplication/setDetailedApplicationData",
              response
            );
            this.createApplicantsArray();
            this.howManyAdults = this.DetailedApplicationData.HowManyAdults;
            this.howManyChildren = this.DetailedApplicationData.HowManyChildren;
            this.loading = false;
          });
      }
    },
    save() {
      this.requestInProgress = true;
      // validate form
      if (validateRepeat(this.$v, this)) {
        this.requestInProgress = false;
        return;
      }
      // map data to store
      this.$store.commit(
        "DetailedApplication/setRelationshipStatuses",
        this.applicantsArray
      );
      this.$store.commit(
        "DetailedApplication/setHowManyAdults",
        this.howManyAdults
      );
      this.$store.commit(
        "DetailedApplication/setHowManyChildren",
        this.howManyChildren
      );
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 4,
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
    validateState(fieldModel) {
      const { $dirty, $error } = fieldModel;
      return $dirty ? !$error : null;
    },
  },
  validations: {
    applicantsArray: {
      $each: {
        id: {},
        firstName: {},
        lastName: {},
        relationshipStatus: {
          required,
        },
        partner: {
          required: requiredIf(function (object) {
            return object.relationshipStatus === "RelationshipWithCoApplicant";
          }),
        },
      },
    },
    howManyAdults: {
      required,
      numeric,
      minValue: minValue(1),
      maxValue: maxValue(100),
    },
    howManyChildren: {
      required,
      numeric,
      minValue: minValue(0),
      maxValue: maxValue(100),
    },
  },
};
</script>

<style lang="scss">
.applicants {
  list-style-type: none;
  padding: 0;
}
.number-input {
  width: 70px;
}
</style>
