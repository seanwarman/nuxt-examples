<template>
  <b-row no-gutters>
    <b-col>
      <p class="mb-0">For {{ ApplicantFirstName }} {{ ApplicantLastName }}</p>
      <label :for="`applicant-total-savings-${savingsIndex}`">
        What is the total of this applicant’s cash savings that will be used to
        repay the Self Build Wales loan?
      </label>
      <b-form-invalid-feedback
        :id="`applicant-total-savings-${savingsIndex}-feedback`"
        class="error mb-3"
        style="color: crimson"
        :state="validateState('SavingsAmount')"
        >Please provide the total of this applicant’s cash savings that will be
        used to repay the Self Build Wales loan</b-form-invalid-feedback
      >
      <b-row>
        <b-col md="4" lg="3" class="mb-4">
          <b-input-group prepend="£">
            <b-form-input
              :id="`applicant-total-savings-${savingsIndex}`"
              :ref="`SavingsAmount-${savingsIndex}`"
              v-model="$v.SavingsAmount.$model"
              :disabled="ReadOnlyDIP"
              type="number"
            ></b-form-input>
          </b-input-group>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import _ from "lodash";
import Vue from "vue";
import Vuelidate from "vuelidate";
import { minValue, required } from "vuelidate/lib/validators";
Vue.use(Vuelidate);

export default {
  props: {
    applicationId: {
      type: String,
      default: null,
    },
    savingsIndex: {
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
    SavingsAmount: {
      get() {
        return this.$store.getters["DecisionInPrinciple/SavingsAmount"](
          this.applicationId
        );
      },
      set(payload) {
        this.$store.commit({
          type: "DecisionInPrinciple/setSavingsAmount",
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
      if (invalidField && invalidField !== "birthDate") {
        invalidField = this.$refs[`${invalidField}-${this.savingsIndex}`];
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
    SavingsAmount: {
      required,
      minValue: minValue(0),
    },
  },
};
</script>
