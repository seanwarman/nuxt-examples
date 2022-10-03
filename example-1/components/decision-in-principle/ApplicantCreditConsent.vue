<template>
  <b-form-group class="mb-2">
    <b-form-invalid-feedback
      :id="`applicant-credit-check-${creditIndex}-feedback`"
      class="error mb-2"
      :state="validateState('CreditCheckConsent')"
    >
      Please indicate the applicant consents to DBW carrying out a Credit
      Quotation
    </b-form-invalid-feedback>
    <b-form-checkbox
      :id="`applicant-credit-check-${creditIndex}`"
      :ref="`CreditCheckConsent-${creditIndex}`"
      v-model="CreditCheckConsent"
      name="applicant-credit-check"
      :disabled="ReadOnlyDIP"
      :value="true"
    >
      I consent to DBW carrying out a Credit Quotation for
      {{ ApplicantFirstName }} {{ ApplicantLastName }}
    </b-form-checkbox>
  </b-form-group>
</template>

<script>
import _ from "lodash";
import Vue from "vue";
import { sameAs } from "vuelidate/lib/validators";

import Vuelidate from "vuelidate";
Vue.use(Vuelidate);

export default {
  props: {
    applicationId: {
      type: String,
      default: null,
    },
    creditIndex: {
      type: Number,
      default: null,
    },
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
    CreditCheckConsent: {
      get() {
        return this.$store.getters["DecisionInPrinciple/CreditCheckConsent"](
          this.applicationId
        );
      },
      set(payload) {
        this.$store.commit({
          type: "DecisionInPrinciple/setCreditCheckConsent",
          data: payload,
          applicationId: this.applicationId,
        });
      },
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    validateChild() {
      this.$v.$touch();
      let invalidField = _.findKey(
        this.$v.$params,
        (value, key) => this.$v[key].$invalid
      );
      if (invalidField) {
        invalidField = this.$refs[`${invalidField}-${this.creditIndex}`];
        const invalidFieldId = invalidField.id;
        document.getElementById(invalidFieldId).scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
      return invalidField;
    },
  },
  validations: {
    CreditCheckConsent: {
      sameAs: sameAs(() => true),
    },
  },
};
</script>
