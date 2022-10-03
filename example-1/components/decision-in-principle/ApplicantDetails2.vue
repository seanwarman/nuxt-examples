<template>
  <b-row no-gutters>
    <b-col>
      <p class="font-weight-bold mb-0">Applicant name</p>
      <p class="mb-3">{{ ApplicantFirstName }} {{ ApplicantLastName }}</p>

      <b-form-group label="Date of birth">
        <b-form-invalid-feedback
          id="birthDate-feedback"
          class="error mb-2"
          :state="validateState('birthDate')"
        >
          <div v-if="!$v.birthDate.day.between" class="error">
            Birth day can only have
            {{
              $v.birthDate.day.$params.between.min +
              " - " +
              $v.birthDate.day.$params.between.max
            }}
            entered
          </div>
          <div v-if="!$v.birthDate.month.between" class="error">
            Birth month can only have
            {{
              $v.birthDate.month.$params.between.min +
              " - " +
              $v.birthDate.month.$params.between.max
            }}
            entered
          </div>
          <div v-if="!$v.birthDate.year.minLength" class="error">
            Birth year input must contain
            {{ $v.birthDate.year.$params.minLength.min }} characters
          </div>
          <div
            v-if="
              !$v.birthDate.day.$error &&
              !$v.birthDate.month.$error &&
              !$v.birthDate.year.$error &&
              !$v.isAdult
            "
            class="error"
          >
            Applicant must be over 18
          </div>
        </b-form-invalid-feedback>
        <b-row :id="`birthDate-${index}`" no-gutters class="mb-4">
          <label class="sr-only" :for="`birthday-day-${index}`">Day</label>
          <b-form-input
            :id="`birthday-day-${index}`"
            :ref="`Birthday-day-${index}`"
            v-model="$v.birthDate.day.$model"
            :disabled="ReadOnlyDIP"
            class="input mr-2"
            type="text"
            placeholder="dd"
            maxlength="2"
            @input="setDateOfBirth"
          />

          <label class="sr-only" :for="`birthday-month-${index}`">Month</label>
          <b-form-input
            :id="`birthday-month-${index}`"
            :ref="`Birthday-month-${index}`"
            v-model="$v.birthDate.month.$model"
            :disabled="ReadOnlyDIP"
            class="input mr-2"
            type="text"
            placeholder="mm"
            maxlength="2"
            @input="setDateOfBirth"
          />

          <label class="sr-only" :for="`birthday-year-${index}`">Year</label>
          <b-form-input
            :id="`birthday-year-${index}`"
            :ref="`Birthday-year-${index}`"
            v-model="$v.birthDate.year.$model"
            :disabled="ReadOnlyDIP"
            class="input large"
            type="text"
            placeholder="yyyy"
            maxlength="4"
            @input="setDateOfBirth"
          />
        </b-row>
      </b-form-group>

      <b-row no-gutters class="mb-3">
        <b-col>
          <p class="mb-1">
            When completed, will this be the only residential property that is
            owned by {{ ApplicantFirstName }} {{ ApplicantLastName }}?
          </p>
          <b-form-invalid-feedback
            class="error mb-2"
            :state="validateState('OnlyResidentialPropertyOwned')"
          >
            Please select if this will be the only residental property owned by
            the applicant
          </b-form-invalid-feedback>
          <b-form-group class="mb-0">
            <b-form-radio-group
              :id="`OnlyResidentialPropertyOwned-${index}`"
              v-model="$v.OnlyResidentialPropertyOwned.$model"
              :disabled="ReadOnlyDIP"
              class="mb-2"
              stacked
              :name="`applicant-only-property-${index}`"
            >
              <b-form-radio name="only-property" :value="true">
                Yes
              </b-form-radio>
              <b-form-radio name="only-property" :value="false">
                No
              </b-form-radio>
            </b-form-radio-group>
            <p
              v-if="OnlyResidentialPropertyOwned === false"
              class="font-italic mb-2"
            >
              You need to tell us about this. Applicants cannot take part in the
              Self Build Wales scheme if they own other properties.
            </p>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row no-gutters class="mb-5">
        <b-col>
          <p class="mb-1">
            When completed, will this be the only residence of
            {{ ApplicantFirstName }} {{ ApplicantLastName }}?
          </p>
          <b-form-invalid-feedback
            class="error mb-2"
            :state="validateState('OnlyResidence')"
          >
            Please select if this will be the only residence of the applicant
          </b-form-invalid-feedback>
          <b-form-radio-group
            :id="`OnlyResidence-${index}`"
            v-model="$v.OnlyResidence.$model"
            :disabled="ReadOnlyDIP"
            class="mb-2"
            stacked
            :name="`applicant-only-residence-${index}`"
          >
            <b-form-radio name="only-residence" :value="true">
              Yes
            </b-form-radio>
            <b-form-radio name="only-residence" :value="false">
              No
            </b-form-radio>
          </b-form-radio-group>
          <p v-if="OnlyResidence === false" class="font-italic mb-2">
            You need to tell us about this. Applicants cannot take part in the
            Self Build Wales scheme if they own other properties.
          </p>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import _ from "lodash";
import {
  required,
  minLength,
  between,
  numeric,
} from "vuelidate/lib/validators";
import { isAdult } from "~/lib/validation";

export default {
  props: {
    applicationId: {
      type: String,
      default: null,
    },
    index: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      birthDate: {
        day: null,
        month: null,
        year: null,
      },
    };
  },
  computed: {
    ReadOnlyDIP: {
      get() {
        return this.$store.getters["Global/ReadOnlyDIP"];
      },
    },
    ApplicantFirstName: {
      get() {
        return this.$store.getters["DecisionInPrinciple/ApplicantFirstName"](
          this.applicationId
        );
      },
    },
    ApplicantLastName: {
      get() {
        return this.$store.getters["DecisionInPrinciple/ApplicantLastName"](
          this.applicationId
        );
      },
    },
    ApplicantDateOfBirth: {
      get() {
        return this.$store.getters["DecisionInPrinciple/ApplicantDateOfBirth"](
          this.applicationId
        );
      },
      set(payload) {
        this.$store.commit({
          type: "DecisionInPrinciple/setApplicantDateOfBirth",
          data: payload,
          applicationId: this.applicationId,
        });
      },
    },
    OnlyResidentialPropertyOwned: {
      get() {
        return this.$store.getters[
          "DecisionInPrinciple/OnlyResidentialPropertyOwned"
        ](this.applicationId);
      },
      set(payload) {
        this.$store.commit({
          type: "DecisionInPrinciple/setOnlyResidentialPropertyOwned",
          data: payload,
          applicationId: this.applicationId,
        });
      },
    },
    OnlyResidence: {
      get() {
        return this.$store.getters["DecisionInPrinciple/OnlyResidence"](
          this.applicationId
        );
      },
      set(payload) {
        this.$store.commit({
          type: "DecisionInPrinciple/setOnlyResidence",
          data: payload,
          applicationId: this.applicationId,
        });
      },
    },
  },
  mounted() {
    if (this.ApplicantDateOfBirth !== "0001-01-01T00:00:00") {
      const d = this.ApplicantDateOfBirth.split(/[-.T :]/);
      this.birthDate = { day: d[2], month: d[1], year: d[0] };
    }
  },
  methods: {
    setDateOfBirth() {
      const newDateOfBirth = `${this.birthDate.year}-${this.birthDate.month}-${this.birthDate.day}T00:00:00`;
      this.ApplicantDateOfBirth = newDateOfBirth;
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    validateStateNested(parent, childName) {
      const { $dirty, $error } = this.$v[parent][childName];
      return $dirty ? !$error : null;
    },
    validateChild() {
      this.$v.$touch();
      const invalidField = _.findKey(
        this.$v.$params,
        (value, key) => this.$v[key].$invalid
      );
      if (invalidField) {
        document
          .getElementById(`${invalidField}-${this.index}`)
          .scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
      }
      return invalidField;
    },
  },
  validations: {
    birthDate: {
      day: {
        required,
        numeric,
        between: between(1, 31),
      },
      month: {
        required,
        numeric,
        between: between(1, 12),
      },
      year: {
        required,
        numeric,
        minLength: minLength(4),
      },
      required,
      isAdult,
    },
    OnlyResidentialPropertyOwned: {
      required,
    },
    OnlyResidence: {
      required,
    },
  },
};
</script>

<style lang="scss">
.input {
  width: 60px;
  &.large {
    width: 72px;
  }
}
</style>
