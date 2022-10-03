<template>
  <b-form-group class="mb-2">
    <b-form-invalid-feedback
      :id="`consent-data-policy-${consentIndex}-feedback`"
      class="error mb-2"
      :state="validateState('DataPrivacyConsent')"
      >Please indicate the applicant consents to the DBW Data Privacy
      Policy</b-form-invalid-feedback
    >
    <b-form-checkbox
      :id="`consent-data-policy-${consentIndex}`"
      :ref="`DataPrivacyConsent-${consentIndex}`"
      v-model="$v.DataPrivacyConsent.$model"
      :disabled="ReadOnlyDIP"
      name="consent-data-policy"
      :value="true"
    >
      I consent to DBW Data Privacy Policy for {{ ApplicantFirstName }}
      {{ ApplicantLastName }}
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
    consentIndex: {
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
    DataPrivacyConsent: {
      get() {
        return this.$store.getters["DecisionInPrinciple/DataPrivacyConsent"](
          this.applicationId
        );
      },
      set(payload) {
        this.$store.commit({
          type: "DecisionInPrinciple/setDataPrivacyConsent",
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
        invalidField = this.$refs[`${invalidField}-${this.consentIndex}`];
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
    DataPrivacyConsent: {
      sameAs: sameAs(() => true),
    },
  },
};
</script>
