<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-3">Architect details</h1>

      <b-row no-gutters class="mb-5">
        <b-col>
          <p class="mb-3">Is an architect required for this project?</p>
          <b-form-invalid-feedback
            id="architectRequired-feedback"
            :state="validateState('architectRequired')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-group
            id="architectRequired"
            ref="architectRequired"
            :disabled="ReadOnlyDA"
          >
            <b-form-radio
              v-model="$v.architectRequired.$model"
              :state="validateState('architectRequired')"
              :value="true"
            >
              Yes
            </b-form-radio>
            <b-form-radio
              v-model="$v.architectRequired.$model"
              :state="validateState('architectRequired')"
              :value="false"
              @change="resetValues"
            >
              No
            </b-form-radio>
          </b-form-group>
        </b-col>
      </b-row>

      <template v-if="architectRequired">
        <p class="font-weight-bold mb-2">Company name</p>
        <div class="mb-3">
          <b-form-invalid-feedback
            id="architectCompanyName-feedback"
            :state="validateState('architectCompanyName')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-input
            id="architectCompanyName"
            ref="architectCompanyName"
            v-model="$v.architectCompanyName.$model"
            :disabled="ReadOnlyDA"
            :state="validateState('architectCompanyName')"
            class="w-50 mb-1"
            type="text"
          />
        </div>

        <p class="font-weight-bold mb-2">Company address</p>
        <AddressFinder
          ref="addressFinder"
          :address="architectCompanyAddress"
          :disabled="ReadOnlyDA"
        />

        <p class="font-weight-bold mb-2">Contact name</p>
        <div class="mb-3">
          <b-form-invalid-feedback
            id="architectContactName-feedback"
            :state="validateState('architectContactName')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-input
            id="architectContactName"
            ref="architectContactName"
            v-model="$v.architectContactName.$model"
            :disabled="ReadOnlyDA"
            :state="validateState('architectContactName')"
            class="w-50 mb-1"
            type="text"
          />
        </div>

        <p class="font-weight-bold mb-2">Contact phone number</p>
        <div class="mb-3">
          <b-form-invalid-feedback
            id="architectContactNumber-feedback"
            :state="validateState('architectContactNumber')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-input
            id="architectContactNumber"
            ref="architectContactNumber"
            v-model="$v.architectContactNumber.$model"
            :disabled="ReadOnlyDA"
            :state="validateState('architectContactNumber')"
            class="w-50 mb-1"
            type="text"
          />
        </div>

        <p class="font-weight-bold mb-2">Contact email</p>
        <div class="mb-5">
          <b-form-invalid-feedback
            id="architectContactEmail-feedback"
            :state="validateState('architectContactEmail')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-input
            id="architectContactEmail"
            ref="architectContactEmail"
            v-model="$v.architectContactEmail.$model"
            :disabled="ReadOnlyDA"
            :state="validateState('architectContactEmail')"
            class="w-50 mb-1"
            type="email"
          />
        </div>
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
import { required, requiredIf } from "vuelidate/lib/validators";
import {
  validateForm,
  validateAddress,
  isAssigned,
  isPhoneNumber,
  isEmail,
} from "~/lib/validation";
import { findBoolean } from "~/lib/globalFunctions";
Vue.use(Vuelidate);
export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      architectRequired: null,
      architectCompanyName: null,
      architectCompanyAddress: {
        address1: null,
        address2: null,
        address3: null,
        city: null,
        postCode: null,
      },
      architectContactName: null,
      architectContactNumber: null,
      architectContactEmail: null,
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
      const a = this.DetailedApplicationData.Architect;
      this.architectRequired = findBoolean(a.IsArchitectRequired);
      this.architectCompanyName = a.CompanyName;
      this.architectCompanyAddress.address1 = a.Address1;
      this.architectCompanyAddress.address2 = a.Address2;
      this.architectCompanyAddress.address3 = a.Address3;
      this.architectCompanyAddress.city = a.City;
      this.architectCompanyAddress.postCode = a.PostCode;
      this.architectContactName = a.CompanyContact;
      this.architectContactNumber = a.CompanyContactPhone;
      this.architectContactEmail = a.CompanyContactEmail;
    },
    resetValues() {
      this.architectCompanyName = null;
      this.architectContactName = null;
      this.architectContactNumber = null;
      this.architectContactEmail = null;
      this.architectCompanyAddress = {
        address1: null,
        address2: null,
        address3: null,
        city: null,
        postCode: null,
      };
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
      if (this.architectRequired && validateAddress(this.$refs.addressFinder)) {
        this.requestInProgress = false;
        return;
      }
      // map address to component state
      if (this.architectRequired) {
        const aa = this.architectCompanyAddress;
        const af = this.$refs.addressFinder;
        aa.address1 = af.address1;
        aa.address2 = af.address2;
        aa.address3 = af.address3;
        aa.city = af.city;
        aa.postCode = af.postCode;
      }
      // map data to store
      this.$store.commit("DetailedApplication/setArchitectDetails", this);
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 17,
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
    architectRequired: {
      required,
      isAssigned,
    },
    architectCompanyName: {
      required: requiredIf(function () {
        return this.architectRequired;
      }),
    },
    architectContactName: {
      required: requiredIf(function () {
        return this.architectRequired;
      }),
    },
    architectContactNumber: {
      required: requiredIf(function () {
        return this.architectRequired;
      }),
      isPhoneNumber,
    },
    architectContactEmail: {
      required: requiredIf(function () {
        return this.architectRequired;
      }),
      isEmail,
    },
  },
};
</script>

<style lang="scss"></style>
